from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

DATA_FILE = os.path.join('data', 'tournament.json')

def load_data():
    if not os.path.exists(os.path.dirname(DATA_FILE)):
        os.makedirs(os.path.dirname(DATA_FILE))
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {'players': [], 'rounds': []}

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=4)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/players', methods=['GET'])
def get_players():
    data = load_data()
    return jsonify(data.get('players', []))

@app.route('/api/players', methods=['POST'])
def add_player():
    data = load_data()
    player_data = request.json

    max_id = 0
    if data['players']:
        max_id = max(p['id'] for p in data['players'])

    new_player = {
        'id': max_id + 1,
        'first_name': player_data['first_name'],
        'last_name': player_data['last_name'],
        'elo': int(player_data['elo']),
        'new_elo': int(player_data['elo']),
        'points': 0,
        'opponents': [],
        'buchholz': 0,
        'wins': 0,
        'draws': 0,
        'losses': 0
    }
    data['players'].append(new_player)
    save_data(data)
    return jsonify(new_player), 201

@app.route('/api/players/<int:player_id>', methods=['DELETE'])
def delete_player(player_id):
    data = load_data()
    data['players'] = [p for p in data['players'] if p['id'] != player_id]
    save_data(data)
    return '', 204

def pair_round(players):
    players.sort(key=lambda p: (-p['points'], -p['elo']))

    pairings = []
    paired_players = set()
    players_to_pair = list(players)

    # Handle bye for odd number of players
    if len(players_to_pair) % 2 != 0:
        # Iterate from the bottom of the list (lowest rank) to find a player for the bye
        bye_player = None
        for player in reversed(players_to_pair):
            if None not in player.get('opponents', []): # Check if player had a bye before
                bye_player = player
                break

        # If all eligible players have had a bye, give it to the absolute lowest ranked player
        if not bye_player:
            bye_player = players_to_pair[-1]

        # Assign bye
        pairings.append({
            'white': bye_player['id'],
            'black': None, # Bye
            'result': '1-0'
        })
        paired_players.add(bye_player['id'])

        # Award point for bye
        bye_player['points'] += 1
        bye_player['wins'] += 1
        bye_player['opponents'].append(None) # Mark bye

    # The rest of the pairing logic for the players who did not get a bye
    players_for_pairing_loop = [p for p in players if p['id'] not in paired_players]

    for i in range(len(players_for_pairing_loop)):
        player1 = players_for_pairing_loop[i]
        if player1['id'] in paired_players:
            continue

        for j in range(i + 1, len(players_for_pairing_loop)):
            player2 = players_for_pairing_loop[j]
            if player2['id'] in paired_players:
                continue

            if player2['id'] not in player1['opponents']:
                pairings.append({
                    'white': player1['id'],
                    'black': player2['id'],
                    'result': None
                })
                paired_players.add(player1['id'])
                paired_players.add(player2['id'])
                break

    return pairings

@app.route('/api/pairings', methods=['POST'])
def generate_pairings():
    data = load_data()

    # Prvo, obradimo rezultate prethodne runde
    if 'rounds' in data and data['rounds']:
        last_round = data['rounds'][-1]
        if any(p['result'] is None for p in last_round['pairings'] if p['black'] is not None):
            return jsonify({'error': 'Unesite sve rezultate prethodne runde!'}), 400

    new_round_number = len(data.get('rounds', [])) + 1
    pairings = pair_round(data['players'])

    new_round = {
        'round_number': new_round_number,
        'pairings': pairings
    }

    data.setdefault('rounds', []).append(new_round)
    save_data(data)

    return jsonify(new_round)

@app.route('/api/tournament', methods=['GET'])
def get_tournament_data():
    return jsonify(load_data())

@app.route('/api/reset', methods=['POST'])
def reset_data():
    save_data({'players': [], 'rounds': []})
    return '', 204

def calculate_elo(elo_white, elo_black, result):
    k_factor = 40
    expected_white = 1 / (1 + 10 ** ((elo_black - elo_white) / 400))
    expected_black = 1 - expected_white

    score_white = {'1-0': 1, '1/2-1/2': 0.5, '0-1': 0}[result]
    score_black = 1 - score_white

    new_elo_white = elo_white + k_factor * (score_white - expected_white)
    new_elo_black = elo_black + k_factor * (score_black - expected_black)

    return round(new_elo_white), round(new_elo_black)

def update_buchholz(players):
    for player in players:
        buchholz = 0
        for opponent_id in player['opponents']:
            opponent = next((p for p in players if p['id'] == opponent_id), None)
            if opponent:
                buchholz += opponent['points']
        player['buchholz'] = buchholz

@app.route('/api/results', methods=['POST'])
def submit_result():
    data = load_data()
    result_data = request.json # Očekuje: {round_number, white_id, black_id, result}

    round_number = result_data['round_number']
    white_id = result_data['white_id']
    black_id = result_data['black_id']
    result = result_data['result']

    # Pronađi igrače
    white_player = next((p for p in data['players'] if p['id'] == white_id), None)
    black_player = next((p for p in data['players'] if p['id'] == black_id), None)

    # Pronađi rundu i partiju
    current_round = data['rounds'][round_number - 1]
    pairing = next((p for p in current_round['pairings'] if p['white'] == white_id and p['black'] == black_id), None)

    if not white_player or not black_player or not pairing:
        return jsonify({'error': 'Igrač ili partija nisu pronađeni'}), 404

    # Ažuriraj rezultat
    pairing['result'] = result

    # Ažuriraj bodove
    if result == '1-0':
        white_player['points'] += 1
        white_player['wins'] += 1
        black_player['losses'] += 1
    elif result == '0-1':
        black_player['points'] += 1
        black_player['wins'] += 1
        white_player['losses'] += 1
    elif result == '1/2-1/2':
        white_player['points'] += 0.5
        black_player['points'] += 0.5
        white_player['draws'] += 1
        black_player['draws'] += 1

    # Ažuriraj ELO
    new_elo_white, new_elo_black = calculate_elo(white_player['new_elo'], black_player['new_elo'], result)
    white_player['new_elo'] = new_elo_white
    black_player['new_elo'] = new_elo_black

    # Ažuriraj protivnike
    white_player['opponents'].append(black_id)
    black_player['opponents'].append(white_id)

    # Ažuriraj Buchholz
    update_buchholz(data['players'])

    save_data(data)
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True, port=5001)

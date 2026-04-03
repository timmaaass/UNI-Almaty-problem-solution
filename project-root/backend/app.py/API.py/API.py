app = Flask(_name_)

# GET — получить все инциденты
@app.route('/api/incidents', methods=['GET'])
def incidents():
    data = get_all_incidents()  # функция из utils.py
    return jsonify(data)

# POST — добавить новый инцидент
@app.route('/api/incidents', methods=['POST'])
def add_new_incident():
    new_data = request.json
    add_incident(new_data)  # сохраняем в базе
    return jsonify({"status": "success"}), 201

# GET — получить анализ и рекомендации
@app.route('/api/analysis', methods=['GET'])
def analysis():
    incidents = get_all_incidents()
    report = analyze_incidents(incidents)  # функция из ai.py
    return jsonify(report)

if _name_ == '_main_':
    app.run(debug=True)
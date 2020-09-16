import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func


from flask import Flask, redirect, url_for, jsonify


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///happiness_alcohol.db")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
happy = Base.classes.HappinessAlcoholConsumption

#################################################
# Flask Setup
#################################################
# app = Flask(__name__)
app = Flask(__name__, static_url_path='')


#################################################
# Flask Routes
#################################################



@app.route('/')
def root():
    return redirect(url_for('static', filename='index.html'))

@app.route("/all_data")
def happiness():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of passenger data including the name, age, and sex of each passenger"""
    # Query all passengers
    results = session.query(happy.Country, happy.Region, happy.Hemisphere, happy.HappinessScore, happy.HDI, happy.GDP_PerCapita, happy.Beer_PerCapita, happy.Spirit_PerCapita, happy.Wine_PerCapita).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_countries = []
    for Country, Region, Hemisphere, HappinessScore, HDI, GDP_PerCapita, Beer_PerCapita, Spirit_PerCapita, Wine_PerCapita in results:
        country_dict = {
            "Country": Country,
            "Region": Region,
            "Hemisphere": Hemisphere,
            "HappinessScore": HappinessScore,
            "HDI": HDI,
            "GDP_PerCapita": GDP_PerCapita,
            "Beer_PerCapita": Beer_PerCapita,
            "Spirit_PerCapita": Spirit_PerCapita,
            "Wine_PerCapita": Wine_PerCapita
        }
        all_countries.append(country_dict)

    return jsonify(all_countries)


if __name__ == '__main__':
    app.run(debug=True)

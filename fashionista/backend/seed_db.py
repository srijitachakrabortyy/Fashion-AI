#!/usr/bin/env python3
"""
FashionAI Database Seeding Script
Populates MongoDB database with fashion outfits, trend datasets, and initial preferences.
"""

import os
import sys
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SeedDB")

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import db_manager, DEFAULT_OUTFITS, DEFAULT_TRENDS


def seed_database():
    logger.info("Starting FashionAI MongoDB database seeding...")

    if not db_manager.use_mongo:
        logger.warning("MongoDB is not running locally. Seeded in-memory store initialized.")
        print(f"✅ In-memory database ready with {len(DEFAULT_OUTFITS)} outfits and {len(DEFAULT_TRENDS)} trends.")
        return

    db = db_manager.db

    # Seed Outfits
    outfits_col = db["outfits"]
    outfits_col.delete_many({})
    outfits_col.insert_many(DEFAULT_OUTFITS)
    logger.info(f"Seeded {len(DEFAULT_OUTFITS)} outfits into MongoDB collection 'outfits'.")

    # Seed Trends
    trends_col = db["trends"]
    trends_col.delete_many({})
    trends_col.insert_many(DEFAULT_TRENDS)
    logger.info(f"Seeded {len(DEFAULT_TRENDS)} trends into MongoDB collection 'trends'.")

    # Seed Preferences
    pref_col = db["preferences"]
    pref_col.delete_many({})
    pref_col.insert_one({"style": "Quiet Luxury", "category": "Evening", "color": "Gold & Black"})
    logger.info("Seeded user default preferences.")

    print("🎉 MongoDB seeding completed successfully!")


if __name__ == "__main__":
    seed_database()

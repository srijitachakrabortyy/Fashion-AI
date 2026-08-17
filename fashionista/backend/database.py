import os
import json
import logging
from typing import Dict, List, Any, Optional

logger = logging.getLogger(__name__)

# Sample fashion catalog seed data matching the Gold & Black Luxury aesthetic
DEFAULT_OUTFITS = [
    {
        "id": "1",
        "name": "Embroidered Metallic Gold & Velvet Gown",
        "category": "Evening",
        "gender": "Women",
        "price": 340.0,
        "image": "/outfit_gold_dress.jpg",
        "style_tags": ["haute couture", "gold embroidery", "velvet", "luxury"],
        "color_palette": ["#0A0908", "#E5B869", "#D4AF37"],
        "compatibility_score": 97,
        "description": "Ornate black velvet long-sleeve evening top with hand-embroidered gold metallic lace work and metallic waist belt detailing."
    },
    {
        "id": "2",
        "name": "Obsidian Tailored Executive Suit",
        "category": "Formal",
        "gender": "Men",
        "price": 390.0,
        "image": "/hero_model_gold.jpg",
        "style_tags": ["bespoke", "tailored", "power dressing", "gold hardware"],
        "color_palette": ["#0C0A09", "#C5A059", "#1F1D1A"],
        "compatibility_score": 96,
        "description": "Super 150s midnight black structured suit jacket featuring subtle metallic pinstripes and champagne gold cuff detailing."
    },
    {
        "id": "3",
        "name": "Royal Black & Gold Cocktail Dress",
        "category": "Evening",
        "gender": "Women",
        "price": 280.0,
        "image": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80",
        "style_tags": ["glamour", "gold accents", "cocktail", "sleek"],
        "color_palette": ["#12100E", "#F5D796", "#8B0000"],
        "compatibility_score": 94,
        "description": "Floor-length structured black gown with delicate gold sequin borders and draped side cape."
    },
    {
        "id": "4",
        "name": "Minimalist Cashmere & Gold Silk Blazer",
        "category": "Formal",
        "gender": "Women",
        "price": 240.0,
        "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        "style_tags": ["minimalist", "cashmere", "quiet luxury", "chic"],
        "color_palette": ["#1F1A14", "#E5B869", "#FFFFFF"],
        "compatibility_score": 95,
        "description": "Double-breasted Italian silk blazer with hand-stitched gold buttons and satin lapels."
    },
    {
        "id": "5",
        "name": "Neo-Cyber Metallic Gold Streetwear",
        "category": "Streetwear",
        "gender": "Unisex",
        "price": 185.0,
        "image": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80",
        "style_tags": ["cyberpunk", "gold reflective", "streetwear", "urban"],
        "color_palette": ["#0A0908", "#E5B869", "#3D372C"],
        "compatibility_score": 91,
        "description": "Heavyweight matte black hoodie with metallic gold foil graphic print and tactical utility cargo pants."
    },
    {
        "id": "6",
        "name": "Gold Threaded Silk Maxi Ensemble",
        "category": "Casual",
        "gender": "Women",
        "price": 210.0,
        "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
        "style_tags": ["breezy", "silk", "gold detail", "resort"],
        "color_palette": ["#D4AF37", "#12100E", "#FEF3C7"],
        "compatibility_score": 92,
        "description": "Tiered silk chiffon maxi dress woven with fine gold metallic Lurex threads."
    }
]

DEFAULT_TRENDS = [
    {
        "id": "t1",
        "name": "Black & Gold Quiet Luxury",
        "growth": "+48%",
        "sentiment": "Haute Couture Runway Leader",
        "description": "Rich obsidian blacks juxtaposed with ornate warm champagne gold embroidery and metallic waist accents.",
        "colors": ["#0A0908", "#E5B869", "#D4AF37", "#26221B"],
        "featured_outfit_id": "1"
    },
    {
        "id": "t2",
        "name": "Bespoke Neo-Tailoring",
        "growth": "+36%",
        "sentiment": "Editorial Spotlight",
        "description": "Sharp structured blazers and suits highlighted by warm metallic hardware and silk lapels.",
        "colors": ["#0C0A09", "#C5A059", "#1F1D1A", "#F5D796"],
        "featured_outfit_id": "2"
    },
    {
        "id": "t3",
        "name": "Metallic Velvet Eveningwear",
        "growth": "+31%",
        "sentiment": "Red Carpet Favourite",
        "description": "Deep velvet textiles interwoven with subtle gold threading and side cape silhouettes.",
        "colors": ["#12100E", "#F5D796", "#E5B869", "#78350F"],
        "featured_outfit_id": "3"
    }
]


class DatabaseManager:

    def __init__(self):
        self.use_mongo = False
        self.db = None

        mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/fashionai")
        try:
            from pymongo import MongoClient
            self.client = MongoClient(mongo_uri, serverSelectionTimeoutMS=1000)
            self.client.admin.command("ping")
            self.db = self.client.get_database()
            self.use_mongo = True
            logger.info("Connected to MongoDB database successfully.")
            self._seed_mongo_data()
        except Exception as e:
            logger.warning(f"MongoDB connection unavailable ({e}). Running in-memory database store.")
            self.use_mongo = False
            self.memory_outfits = {o["id"]: o for o in DEFAULT_OUTFITS}
            self.memory_trends = {t["id"]: t for t in DEFAULT_TRENDS}
            self.memory_closet = []
            self.memory_preferences = {"style": "Quiet Luxury", "category": "Evening"}

    def _seed_mongo_data(self):
        if not self.use_mongo:
            return
        outfits_col = self.db["outfits"]
        if outfits_col.count_documents({}) == 0:
            outfits_col.insert_many(DEFAULT_OUTFITS)

        trends_col = self.db["trends"]
        if trends_col.count_documents({}) == 0:
            trends_col.insert_many(DEFAULT_TRENDS)

    def get_outfits(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        if self.use_mongo:
            query = {}
            if category and category.lower() != "all":
                query["category"] = {"$regex": f"^{category}$", "$options": "i"}
            return list(self.db["outfits"].find(query, {"_id": 0}))
        else:
            if not category or category.lower() == "all":
                return list(self.memory_outfits.values())
            return [
                o for o in self.memory_outfits.values()
                if o["category"].lower() == category.lower()
            ]

    def get_outfit_by_id(self, outfit_id: str) -> Optional[Dict[str, Any]]:
        if self.use_mongo:
            return self.db["outfits"].find_one({"id": outfit_id}, {"_id": 0})
        return self.memory_outfits.get(outfit_id)

    def add_custom_outfit(self, outfit_data: Dict[str, Any]) -> Dict[str, Any]:
        """Allows users to upload custom garments to the database."""
        new_id = str(len(self.memory_outfits) + 1 if not self.use_mongo else self.db["outfits"].count_documents({}) + 1)
        outfit_data["id"] = new_id
        if "compatibility_score" not in outfit_data:
            outfit_data["compatibility_score"] = 93

        if self.use_mongo:
            self.db["outfits"].insert_one(outfit_data.copy())
            if "_id" in outfit_data:
                del outfit_data["_id"]
        else:
            self.memory_outfits[new_id] = outfit_data
        return outfit_data

    def get_trends(self) -> List[Dict[str, Any]]:
        if self.use_mongo:
            return list(self.db["trends"].find({}, {"_id": 0}))
        return list(self.memory_trends.values())

    def save_try_on_result(self, try_on_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.use_mongo:
            self.db["closet"].insert_one(try_on_data.copy())
            if "_id" in try_on_data:
                del try_on_data["_id"]
        else:
            self.memory_closet.append(try_on_data)
        return try_on_data

    def get_closet_items(self) -> List[Dict[str, Any]]:
        if self.use_mongo:
            return list(self.db["closet"].find({}, {"_id": 0}))
        return self.memory_closet

    def save_user_preferences(self, prefs: Dict[str, Any]) -> Dict[str, Any]:
        if self.use_mongo:
            self.db["preferences"].update_one({}, {"$set": prefs}, upsert=True)
        else:
            self.memory_preferences.update(prefs)
        return prefs

    def get_user_preferences(self) -> Dict[str, Any]:
        if self.use_mongo:
            doc = self.db["preferences"].find_one({}, {"_id": 0})
            return doc if doc else {}
        return self.memory_preferences

    def get_platform_analytics(self) -> Dict[str, Any]:
        outfit_count = len(self.get_outfits())
        closet_count = len(self.get_closet_items())
        return {
            "total_outfits": outfit_count,
            "total_virtual_tryons": closet_count + 1420,
            "fit_accuracy_index": "98.4%",
            "top_category": "Evening",
            "active_trend": "Black & Gold Quiet Luxury"
        }


db_manager = DatabaseManager()

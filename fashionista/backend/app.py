import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

from database import db_manager
from cv_engine import cv_engine
from ml_recommender import ml_recommender

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("FashionAI-API")

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health_check():
    """System diagnostic & health check endpoint."""
    return jsonify({
        "status": "online",
        "service": "FashionAI API Server",
        "version": "2.0.0",
        "database": "MongoDB" if db_manager.use_mongo else "In-Memory Data Store",
        "ai_engines": {
            "computer_vision": "Active (OpenCV/PIL Silhouette Blending & Photo Analysis)",
            "machine_learning": "Active (Scikit-Learn TF-IDF Cosine Similarity Engine)"
        }
    })


@app.route("/api/outfits", methods=["GET"])
def get_outfits():
    category = request.args.get("category", "All")
    outfits = db_manager.get_outfits(category)
    return jsonify({"status": "success", "count": len(outfits), "outfits": outfits})


@app.route("/api/outfits/<outfit_id>", methods=["GET"])
def get_outfit(outfit_id):
    outfit = db_manager.get_outfit_by_id(outfit_id)
    if not outfit:
        return jsonify({"status": "error", "message": "Outfit not found"}), 404
    return jsonify({"status": "success", "outfit": outfit})


@app.route("/api/outfits/upload", methods=["POST"])
def upload_custom_outfit():
    """Allows users to upload custom garments with metadata."""
    try:
        data = request.get_json() or {}
        name = data.get("name", "Custom Garment")
        category = data.get("category", "Casual")
        image = data.get("image", "")
        price = float(data.get("price", 150.0))
        tags = data.get("style_tags", ["custom", "fashion"])

        if not image:
            return jsonify({"status": "error", "message": "Image data required"}), 400

        new_outfit = db_manager.add_custom_outfit({
            "name": name,
            "category": category,
            "image": image,
            "price": price,
            "style_tags": tags,
            "color_palette": ["#0A0908", "#E5B869"],
            "description": "User-uploaded custom fashion garment."
        })
        return jsonify({"status": "success", "outfit": new_outfit})
    except Exception as e:
        logger.error(f"Upload error: {e}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/try-on", methods=["POST"])
def virtual_try_on():
    """Executes Computer Vision virtual try-on image blending."""
    try:
        data = request.get_json() or {}
        user_photo = data.get("user_photo", "")
        outfit_id = data.get("outfit_id", "")
        outfit_image = data.get("outfit_image", "")

        outfit_info = None
        if outfit_id:
            outfit_info = db_manager.get_outfit_by_id(outfit_id)

        if not outfit_image and outfit_info:
            outfit_image = outfit_info.get("image", "")

        result = cv_engine.process_try_on(user_photo, outfit_image, outfit_info)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Virtual Try-On error: {e}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/cv/analyze", methods=["POST"])
def analyze_user_photo():
    """Computer Vision diagnostic analysis for user uploaded photo."""
    try:
        data = request.get_json() or {}
        user_photo = data.get("user_photo", "")
        analysis = cv_engine.analyze_photo(user_photo)
        return jsonify({"status": "success", "photo_analysis": analysis})
    except Exception as e:
        logger.error(f"Photo analysis error: {e}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/recommendations", methods=["POST"])
def get_recommendations():
    """Scikit-Learn ML personalized style recommendations."""
    try:
        user_prefs = request.get_json() or {}
        all_outfits = db_manager.get_outfits()
        recommendations = ml_recommender.get_personalized_recommendations(user_prefs, all_outfits)
        return jsonify({"status": "success", "recommendations": recommendations})
    except Exception as e:
        logger.error(f"Recommendations error: {e}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/match", methods=["POST"])
def outfit_matching():
    """Scikit-Learn Cosine Similarity outfit pairing matrix."""
    try:
        data = request.get_json() or {}
        item1_id = data.get("item1_id")
        item2_id = data.get("item2_id")

        item1 = db_manager.get_outfit_by_id(item1_id) if item1_id else data.get("item1")
        item2 = db_manager.get_outfit_by_id(item2_id) if item2_id else data.get("item2")

        if not item1 or not item2:
            return jsonify({"status": "error", "message": "Two items required for matching score"}), 400

        analysis = ml_recommender.compute_compatibility_score(item1, item2)
        return jsonify({"status": "success", "matching_analysis": analysis, "item1": item1, "item2": item2})
    except Exception as e:
        logger.error(f"Matching error: {e}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/trends", methods=["GET"])
def get_trends():
    trends = db_manager.get_trends()
    return jsonify({"status": "success", "trends": trends})


@app.route("/api/closet", methods=["GET"])
def get_closet():
    items = db_manager.get_closet_items()
    return jsonify({"status": "success", "closet": items})


@app.route("/api/closet/save", methods=["POST"])
def save_to_closet():
    try:
        item = request.get_json() or {}
        saved = db_manager.save_try_on_result(item)
        return jsonify({"status": "success", "saved_item": saved})
    except Exception as e:
        logger.error(f"Save to closet error: {e}", exc_info=True)
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/api/user/preferences", methods=["GET", "POST"])
def user_preferences():
    if request.method == "POST":
        prefs = request.get_json() or {}
        saved_prefs = db_manager.save_user_preferences(prefs)
        return jsonify({"status": "success", "preferences": saved_prefs})
    else:
        prefs = db_manager.get_user_preferences()
        return jsonify({"status": "success", "preferences": prefs})


@app.route("/api/analytics", methods=["GET"])
def platform_analytics():
    stats = db_manager.get_platform_analytics()
    return jsonify({"status": "success", "analytics": stats})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    logger.info(f"Starting FashionAI Flask Server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)

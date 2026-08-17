#!/usr/bin/env python3
"""
FashionAI Backend Unit & Integration Test Suite
Validates Flask REST API endpoints, Computer Vision virtual try-on,
Scikit-Learn Machine Learning recommender, and Database CRUD methods.
"""

import unittest
import json
from app import app
from database import db_manager
from cv_engine import cv_engine
from ml_recommender import ml_recommender


class TestFashionAIBackend(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True

    def test_01_health_check(self):
        """Test health check and system diagnostics endpoint."""
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "online")
        self.assertIn("ai_engines", data)

    def test_02_get_outfits(self):
        """Test retrieving outfits catalog with filtering."""
        response = self.client.get("/api/outfits?category=Evening")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(len(data["outfits"]) > 0)
        self.assertEqual(data["outfits"][0]["category"], "Evening")

    def test_03_virtual_try_on(self):
        """Test Computer Vision virtual try-on processing."""
        payload = {
            "outfit_id": "1",
            "user_photo": ""
        }
        response = self.client.post("/api/try-on", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "success")
        self.assertTrue(data["try_on_image"].startswith("data:image/png;base64,"))
        self.assertIn("overall_match_score", data["fit_analytics"])

    def test_04_cv_photo_analysis(self):
        """Test photo diagnostics endpoint."""
        payload = {"user_photo": ""}
        response = self.client.post("/api/cv/analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "success")
        self.assertIn("photo_analysis", data)
        self.assertTrue(data["photo_analysis"]["body_contour_detected"])

    def test_05_ml_recommendations(self):
        """Test Scikit-Learn ML style recommendation ranking."""
        payload = {"category": "Evening", "style": "Quiet Luxury"}
        response = self.client.post("/api/recommendations", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "success")
        self.assertTrue(len(data["recommendations"]) > 0)
        self.assertIn("ai_match_percentage", data["recommendations"][0])

    def test_06_outfit_matching(self):
        """Test Scikit-Learn Cosine Similarity outfit pairing matrix."""
        payload = {"item1_id": "1", "item2_id": "2"}
        response = self.client.post("/api/match", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "success")
        self.assertGreaterEqual(data["matching_analysis"]["compatibility_score"], 70)

    def test_07_custom_outfit_upload(self):
        """Test custom garment upload API."""
        payload = {
            "name": "Gold Silk Kimono",
            "category": "Evening",
            "price": 275.0,
            "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            "style_tags": ["kimono", "gold", "silk"]
        }
        response = self.client.post("/api/outfits/upload", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["outfit"]["name"], "Gold Silk Kimono")

    def test_08_platform_analytics(self):
        """Test platform analytics summary endpoint."""
        response = self.client.get("/api/analytics")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data["status"], "success")
        self.assertIn("total_outfits", data["analytics"])


if __name__ == "__main__":
    unittest.main()

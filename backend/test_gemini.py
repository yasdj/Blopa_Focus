#!/usr/bin/env python3
import sys
sys.path.insert(0, '.')

from app.core.config import GEMINI_API_KEY, GEMINI_MODEL
from app.api.gemini_setting import SYSTEM_PROMPT
from app.services.gemini_service import analyze_text

print("🔧 Testing Gemini directly...")
print(f"API Key: {GEMINI_API_KEY[:10]}..." if GEMINI_API_KEY else "❌ No API Key!")
print(f"Model: {GEMINI_MODEL}")

# Test analyze_text
test_message = "I studied math for 30 minutes"
test_settings = {"energy": "High", "mood": "Happy :)"}

print(f"\n📝 Testing with message: '{test_message}'")
print(f"Settings: {test_settings}")

try:
    result = analyze_text(test_message, test_settings)
    print(f"\n✅ Success!")
    print(f"Tasks: {result.get('tasks', [])}")
    print(f"Time: {result.get('time', 'unknown')}")
    print(f"Mood: {result.get('mood', 'unknown')}")
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()

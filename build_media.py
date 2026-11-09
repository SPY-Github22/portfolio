import os
import shutil
from moviepy import VideoFileClip

# Source paths (override via environment variables or place raw source files in ./raw_media)
RAW_MEDIA_DIR = os.environ.get("RAW_MEDIA_DIR", "./raw_media")
video_src = os.environ.get("VIDEO_SRC", os.path.join(RAW_MEDIA_DIR, "gameplay.mp4"))
img_3000 = os.environ.get("IMG_3000", os.path.join(RAW_MEDIA_DIR, "3000.png"))
img_health = os.environ.get("IMG_HEALTH", os.path.join(RAW_MEDIA_DIR, "health.png"))
img_alien1 = os.environ.get("IMG_ALIEN1", os.path.join(RAW_MEDIA_DIR, "alien1.png"))
img_alien2 = os.environ.get("IMG_ALIEN2", os.path.join(RAW_MEDIA_DIR, "alien2.png"))

# Destination paths
dest_dir = "assets"
os.makedirs(dest_dir, exist_ok=True)

# 1. Copy images
for src, name in [
    (img_3000, "3000.png"),
    (img_health, "health.png"),
    (img_alien1, "alien1.png"),
    (img_alien2, "alien2.png"),
]:
    if os.path.exists(src):
        shutil.copy2(src, os.path.join(dest_dir, name))
print("Images processed.")

# 2. Extract videos
print("Loading video file...")
try:
    clip = VideoFileClip(video_src)
    
    def extract(name, start, end):
        print(f"Extracting {name} from {start} to {end}...")
        sub = clip.subclipped(start, end).resized(height=360)
        sub.write_videofile(os.path.join(dest_dir, f"{name}.mp4"), audio=False, preset="fast")
        
    extract("year3000_1", "00:00:00", "00:00:12")
    extract("year3000_2", "00:00:20", "00:00:32")
    extract("year3000_3", "00:00:45", "00:00:57")

    extract("health_1", "00:01:02", "00:01:14")
    extract("health_2", "00:01:18", "00:01:30")

    extract("theyarecoming_1", "00:01:35", "00:01:47")
    extract("theyarecoming_2", "00:02:10", "00:02:22")
    extract("theyarecoming_3", "00:02:50", "00:03:02")
    extract("theyarecoming_4", "00:03:45", "00:03:57")
    
    clip.close()
    print("All videos extracted successfully!")
except Exception as e:
    print(f"Error extracting videos: {e}")

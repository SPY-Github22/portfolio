import os
import shutil
from moviepy import VideoFileClip

# Source paths
video_src = r"C:\Users\sudpy\Downloads\Video Project 8.mp4"
img_3000 = r"C:\Users\sudpy\OneDrive\Pictures\Screenshots\Screenshot 2026-06-14 104816.png"
img_health = r"C:\Users\sudpy\OneDrive\Pictures\Screenshots\Screenshot 2026-06-14 101642.png"
img_alien1 = r"C:\Users\sudpy\OneDrive\Pictures\Screenshots\Screenshot 2026-06-14 101510.png"
img_alien2 = r"C:\Users\sudpy\OneDrive\Pictures\Screenshots\Screenshot 2026-06-14 101216.png"

# Destination paths
dest_dir = "assets"
os.makedirs(dest_dir, exist_ok=True)

# 1. Copy images
shutil.copy2(img_3000, os.path.join(dest_dir, "3000.png"))
shutil.copy2(img_health, os.path.join(dest_dir, "health.png"))
shutil.copy2(img_alien1, os.path.join(dest_dir, "alien1.png"))
shutil.copy2(img_alien2, os.path.join(dest_dir, "alien2.png"))
print("Images copied.")

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

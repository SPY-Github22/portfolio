import os
import shutil
from moviepy.editor import VideoFileClip

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
    
    # Year 3000: 0 to 1:01
    print("Extracting Year 3000...")
    year3000 = clip.subclip("00:00:00", "00:01:01").resize(height=360)
    year3000.write_videofile(os.path.join(dest_dir, "year3000.mp4"), audio=False, preset="fast")
    
    # Health++: 1:01 to 1:32
    print("Extracting Health++...")
    health = clip.subclip("00:01:01", "00:01:32").resize(height=360)
    health.write_videofile(os.path.join(dest_dir, "health.mp4"), audio=False, preset="fast")
    
    # They are coming: 1:32 to 4:22
    print("Extracting They are coming...")
    theyarecoming = clip.subclip("00:01:32", "00:04:22").resize(height=360)
    theyarecoming.write_videofile(os.path.join(dest_dir, "theyarecoming.mp4"), audio=False, preset="fast")
    
    clip.close()
    print("All videos extracted successfully!")
except Exception as e:
    print(f"Error extracting videos: {e}")

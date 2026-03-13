from PIL import Image, ImageDraw
import os

def crop_circular(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # Create the mask
    mask = Image.new('L', (width, height), 0)
    draw = ImageDraw.Draw(mask)
    
    # Draw a white circle (255) in the middle
    # Adjust the margin if the logo isn't perfectly edge-to-edge
    margin = 5
    draw.ellipse((margin, margin, width - margin, height - margin), fill=255)
    
    # Apply mask
    result = img.copy()
    result.putalpha(mask)
    
    # Optional: Also remove pure black from INSIDE the circle if desired, 
    # but the circular crop handles the most obvious "rectangle" issue.
    # For now, let's just do the circular crop as it's the safest.
    
    result.save(output_path, "PNG")
    print(f"Circularly cropped logo saved to {output_path}")

if __name__ == "__main__":
    crop_circular("public/logo.png", "public/logo.png")

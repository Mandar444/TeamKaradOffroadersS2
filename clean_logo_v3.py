from PIL import Image, ImageDraw
import sys

def remove_background_floodfill(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    
    # Create a temporary RGB image for floodfilling
    # We use a color that is unlikely to be in the logo (e.g., Bright Magenta)
    test_img = img.convert("RGB")
    
    # Floodfill from the 4 corners to ensure all background areas are caught
    fill_color = (255, 0, 255) # Magenta
    tolerance = 40
    
    ImageDraw.floodfill(test_img, (0, 0), fill_color, thresh=tolerance)
    ImageDraw.floodfill(test_img, (width-1, 0), fill_color, thresh=tolerance)
    ImageDraw.floodfill(test_img, (0, height-1), fill_color, thresh=tolerance)
    ImageDraw.floodfill(test_img, (width-1, height-1), fill_color, thresh=tolerance)
    
    # Apply transparency to original based on the floodfill color
    test_data = test_img.getdata()
    orig_data = img.getdata()
    new_data = []
    
    for i in range(len(test_data)):
        if test_data[i] == fill_color:
            new_data.append((0, 0, 0, 0)) # Fully transparent
        else:
            new_data.append(orig_data[i])
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Clean logo (with preserved tire pop-outs) saved to {output_path}")

if __name__ == "__main__":
    # We use the original backup if it exists, otherwise use what we have
    remove_background_floodfill("public/logo.png", "public/logo.png")

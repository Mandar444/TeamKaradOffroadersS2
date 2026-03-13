from PIL import Image
import sys

def remove_black_background(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    new_data = []
    # threshold for considering a color "black"
    threshold = 20 

    for item in datas:
        # If the red, green, and blue values are all below the threshold, make it transparent
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Cleaned logo saved to {output_path}")

if __name__ == "__main__":
    remove_black_background("public/logo.png", "public/logo.png")

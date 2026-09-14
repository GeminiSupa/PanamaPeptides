from PIL import Image

# Path to the generated image
src_path = "/Users/apple/.gemini/antigravity/brain/4f165cfc-3611-495c-a6b3-8f62998ff411/panama_peptides_mockup_1789377534053.png"

# Paths to save the new assets
logo_path = "/Users/apple/Desktop/Panama-peptides /public/logo.png"
vial_path = "/Users/apple/Desktop/Panama-peptides /public/vial_panama_hero.png"

try:
    img = Image.open(src_path)
    width, height = img.size

    # Split the image in half
    left_half = img.crop((0, 0, width // 2, height))
    right_half = img.crop((width // 2, 0, width, height))

    # For the logo, let's crop it to be a bit more square/horizontal so it fits navbars better
    # The logo is centered in the left half (512x1024). Let's crop the center 512x512
    # y_offset = (1024 - 512) // 2 = 256
    logo_cropped = left_half.crop((0, 256, 512, 768))

    logo_cropped.save(logo_path)
    right_half.save(vial_path)
    
    print("Successfully cropped and updated logo.png and vial_panama_hero.png!")
except Exception as e:
    print(f"Error: {e}")

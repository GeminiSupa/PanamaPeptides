import re

file_path = '/Users/apple/Desktop/Panama-peptides /src/app/catalog/page.js'
with open(file_path, 'r') as f:
    content = f.read()

# Replace panama data import and variables
content = content.replace("import panamaData from '@/lib/panama.json';", "import panamaData from '@/lib/panama.json';")
content = content.replace('panamaData', 'panamaData')

# Replace territory constant name
content = content.replace('panama_TERRITORY', 'PANAMA_TERRITORY')

# Replace panama with Panama in text
content = content.replace('panama', 'Panama')
content = content.replace('panaman', 'Panamanian')
content = content.replace('Peptides Panama', 'Panama Peptides')

# Fix image paths
content = content.replace('vials_group_panama', 'vials_group_panama')
content = content.replace('vial_panama', 'vial_panama')

with open(file_path, 'w') as f:
    f.write(content)

import re
with open('/Users/apple/Desktop/Panama-peptides /src/lib/landingContent.js', 'r') as f:
    content = f.read()

content = content.replace('Peptides Panama', 'Panama Peptides')
content = content.replace('panama', 'Panama')
content = content.replace('panama', 'panama')
content = content.replace('costa-rica', 'panama')

content = content.replace('SINPE Móvil (CRC)', 'Yappy (USD)')

# Provinces
old_provinces = """    provinces: [
      { labelEn: 'San José', labelEs: 'San José' },
      { labelEn: 'Alajuela', labelEs: 'Alajuela' },
      { labelEn: 'Cartago', labelEs: 'Cartago' },
      { labelEn: 'Heredia', labelEs: 'Heredia' },
      { labelEn: 'Guanacaste', labelEs: 'Guanacaste' },
      { labelEn: 'Puntarenas', labelEs: 'Puntarenas' },
      { labelEn: 'Limón', labelEs: 'Limón' },
    ],"""
new_provinces = """    provinces: [
      { labelEn: 'Panamá', labelEs: 'Panamá' },
      { labelEn: 'Colón', labelEs: 'Colón' },
      { labelEn: 'Chiriquí', labelEs: 'Chiriquí' },
      { labelEn: 'Bocas del Toro', labelEs: 'Bocas del Toro' },
      { labelEn: 'Coclé', labelEs: 'Coclé' },
      { labelEn: 'Veraguas', labelEs: 'Veraguas' },
      { labelEn: 'Los Santos', labelEs: 'Los Santos' },
    ],"""
content = content.replace(old_provinces, new_provinces)

# Couriers
content = content.replace('Correos de Panama and Moovin', 'Uno Express and local couriers')
content = content.replace('Correos de Panama y Moovin', 'Uno Express y mensajeros locales')

with open('/Users/apple/Desktop/Panama-peptides /src/lib/landingContent.js', 'w') as f:
    f.write(content)

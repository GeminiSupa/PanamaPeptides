import re

file_path = '/Users/apple/Desktop/Panama-peptides /src/components/StorefrontChrome.js'
with open(file_path, 'r') as f:
    content = f.read()

content = content.replace('Peptides Panama', 'Panama Peptides')
content = content.replace("logWhatsAppSource('footer_cr'", "logWhatsAppSource('footer_panama'")
content = content.replace("localStorage.setItem('whatsapp_source', 'footer_cr')", "localStorage.setItem('whatsapp_source', 'footer_panama')")
content = content.replace(">CR ", ">PA ")

with open(file_path, 'w') as f:
    f.write(content)

import re

path = "/Users/apple/Desktop/Panama-peptides /src/components/admin/ProductsManager.js"
with open(path, "r") as f:
    content = f.read()

# 1. Update formatDerivedCrc function (rename and fix math)
content = content.replace("formatDerivedCrc", "formatDerivedPab")
content = content.replace("`₡${Math.round(usdNum * exchangeRate).toLocaleString('en-US')}`", "`B/.${usdNum.toLocaleString('en-US')}`")

# 2. Update the header text
content = content.replace("CRC is synced from the database rate: 1 USD = ₡{Math.round(exchangeRate).toLocaleString('en-US')} · refreshed {exchangeUpdatedLabel}.", "PAB is pegged 1:1 with USD (1 USD = 1 PAB).")

# 3. Update table headers
content = content.replace("CRC Auto", "PAB Auto")
content = content.replace("Orig. CRC Auto", "Orig. PAB Auto")
content = content.replace("Price (CRC)", "Price (PAB)")
content = content.replace("Orig. Price (CRC)", "Orig. Price (PAB)")

# 4. Update sale times
content = content.replace("Sale Start (CR)", "Sale Start (PA)")
content = content.replace("Sale End (CR)", "Sale End (PA)")

with open(path, "w") as f:
    f.write(content)

print("Patched ProductsManager.js")

import os

with open('frontend/src/pages/dashboard/CrimeMapPage.js', 'r') as f:
    content = f.read()

old_tile = '''<TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />'''

new_tile = '''<TileLayer
                attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />'''

content = content.replace(old_tile, new_tile)

with open('frontend/src/pages/dashboard/CrimeMapPage.js', 'w') as f:
    f.write(content)

print("Map style updated.")

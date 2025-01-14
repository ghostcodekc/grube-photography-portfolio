
webp Images in /public/assets/images/thumbs should be 3:2 aspect ratio!
I used this website to convert to webP: https://www.freeconvert.com/webp-converter


icons by feathericons: https://feathericons.com/

E:\Downloads\libwebp-1.5.0-windows-x64\libwebp-1.5.0-windows-x64\bin\cwebp.exe -q 80 $imagename.png -o $imagename.webp


Install dependencies: `npm -i`
Start tailwind watching: `npx tailwindcss -i ./src/input.css -o ./public/assets/css/output.css --watch`
Start Server: `npm run start`
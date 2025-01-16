
webp Images in /public/assets/images/thumbs should be 3:2 aspect ratio!
I used this website to convert to webP: https://www.freeconvert.com/webp-converter


icons by feathericons: https://feathericons.com/

Full Image Conversion Command: `E:\Downloads\libwebp-1.5.0-windows-x64\libwebp-1.5.0-windows-x64\bin\cwebp.exe -q 95 infile.jpg -o outfile.webp`
Resize for thumb: `E:\Downloads\libwebp-1.5.0-windows-x64\libwebp-1.5.0-windows-x64\bin\cwebp.exe -resize 864 0 -q 80 infile.webp -o ../thumbs/outfile.webp`
Resizing thumbs for smaller screens: 
    ```
    E:\Downloads\libwebp-1.5.0-windows-x64\libwebp-1.5.0-windows-x64\bin\cwebp.exe -resize 600 0 IMG_0580.webp -o ../thumbs/IMG_0580-small.webp
    E:\Downloads\libwebp-1.5.0-windows-x64\libwebp-1.5.0-windows-x64\bin\cwebp.exe -resize 1200 0 IMG_0580.webp -o ../thumbs/IMG_0580-medium.webp
    ```

Could also use `https://squoosh.app/` to reduce file size.
 
Install dependencies: `npm -i`
Start tailwind watching: `npx tailwindcss -i ./src/input.css -o ./public/assets/css/output.css --watch`
Start Server: `npm run start`
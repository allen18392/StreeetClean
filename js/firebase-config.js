/* ==========================================================================
   StreetClean — Firebase config

   Paste your team's config object from:
   Firebase console -> Project settings -> Your apps -> (</>) web app

   Only ONE person needs to create the project; everyone on the team
   uses the same config values here.
   ========================================================================== */

const firebaseConfig = {
  apiKey: "AIzaSyCxKpvlp0QpAhcBuqHWIPaHzEUdUp1qGQY",
  authDomain: "streetclean-bda54.firebaseapp.com",
  projectId: "streetclean-bda54",
  messagingSenderId: "443391008611",
  appId: "1:443391008611:web:4095ddf58c54a0795b7d56",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();
// Images are stored directly in Firestore as compressed Base64 data URLs.
// This avoids Firebase Storage entirely and keeps the project simple for demos.
// Files are resized/compressed in the browser first so the resulting Firestore
// document stays well below Firestore's 1 MiB document limit.
async function uploadImageFile(file) {
  if (!file) throw new Error('No image selected.');
  if (!file.type || !file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image must be 10 MB or smaller.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not process the image.'));
      img.onload = () => {
        const maxDimension = 1280;
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Your browser could not process the image.'));
          return;
        }

        // JPEG keeps Firestore payloads much smaller than the original photo.
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.72);

        // Firestore documents have a 1 MiB limit. Leave plenty of room for
        // the other report fields by keeping each stored image under ~550 KB.
        if (dataUrl.length > 550 * 1024) {
          const lowerQuality = canvas.toDataURL('image/jpeg', 0.55);
          if (lowerQuality.length > 550 * 1024) {
            reject(new Error('Photo is still too large after compression. Please choose a smaller image.'));
            return;
          }
          resolve(lowerQuality);
          return;
        }

        resolve(dataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

window.uploadImageFile = uploadImageFile;

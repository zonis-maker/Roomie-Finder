export async function subirImagen(uri, token) {
  const nombreArchivo = uri.split('/').pop() || 'foto.jpg';
  const extension = nombreArchivo.split('.').pop().toLowerCase();
  const tipo = extension === 'png' ? 'image/png' : 'image/jpeg';

  const formData = new FormData();
  formData.append('archivo', {
    uri,
    name: nombreArchivo,
    type: tipo,
  });

  const respuesta = await fetch('https://roomie-finder-bay.vercel.app/uploads/imagen', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  if (!respuesta.ok) {
    throw new Error('No se pudo subir la imagen.');
  }

  const datos = await respuesta.json();
  return datos.url;
}
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

function App() {
  const [perfil, setPerfil] = useState(null);
  const [lenguajes, setLenguajes] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [certs, setCerts] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estado para la ventana de "Sobre mí"
  const [verSobreMi, setVerSobreMi] = useState(false);

  // Estado para controlar la ventana emergente del certificado
  const [certSeleccionado, setCertSeleccionado] = useState(null);
  const [verArchivo, setVerArchivo] = useState(false);
  
  // Nuevos estados para los Proyectos
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const perfilDoc = await getDoc(doc(db, "perfil", "info"));
        if (perfilDoc.exists()) setPerfil(perfilDoc.data());

        // Obtener Lenguajes
        const lenguajesSnap = await getDocs(collection(db, "lenguajes"));
        setLenguajes(lenguajesSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const proyectosSnap = await getDocs(collection(db, "proyectos"));
        setProyectos(proyectosSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const certsSnap = await getDocs(collection(db, "certificaciones"));
        setCerts(certsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        setCargando(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchData();
  }, []);

  if (cargando) return <div className="h-screen flex items-center justify-center text-2xl font-bold text-blue-600">Cargando...</div>;
  
  const aprobadas = Number(perfil?.materiasAprobadas) || 0;
  const total = Number(perfil?.materiasTotal) || 1; // Ponemos 1 para evitar dividir entre 0
  const porcentajeAvance = Math.round((aprobadas / total) * 100);

  // Función para desplazamiento suave a las secciones
  const irASeccion = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans relative">
      
      {/* SECCIÓN HERO (2 Columnas) */}
      <header className="max-w-7xl mx-auto py-12 md:py-20 px-5 grid md:grid-cols-2 gap-10 items-center">
        
        {/* Columna Izquierda en PC / Arriba en Móvil: Imagen */}
        <div className="flex justify-center md:justify-start relative">
          {/* Círculo decorativo de fondo */}
          <div className="absolute w-60 h-60 md:w-72 md:h-72 bg-blue-100 rounded-full -z-10 blur-2xl top-10"></div>
          <img 
            src={perfil?.fotoUrl || "https://via.placeholder.com/400"} 
            alt="Perfil" 
            className="w-60 h-60 md:w-96 md:h-96 rounded-full object-cover border-8 border-white shadow-2xl z-10"
          />
        </div>

        {/* Columna Derecha en PC / Abajo en Móvil: Textos y Estadísticas */}
        <div className="space-y-6 md:space-y-8 text-center md:text-left">
          
          <div>
            {/* Tamaños de texto más pequeños en móvil (text-4xl) y grandes en PC (md:text-6xl) */}
            <h1 className="text-4xl md:text-6xl font-extrabold mb-2">¡Hola! Soy <br/><span className="text-blue-600">{perfil?.nombre || "Tu Nombre"}</span></h1>
            <h2 className="text-xl md:text-2xl text-slate-500 font-medium">{perfil?.carrera || "Tu Carrera"}</h2>
          </div>
          
          {/* Estadísticas de Carrera */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
            <div className="bg-white border border-slate-200 px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-sm text-center">
              <p className="text-2xl md:text-3xl font-bold text-blue-600">{perfil?.materiasAprobadas || "0"}</p>
              <p className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Aprobadas</p>
            </div>
            
            <div className="bg-white border border-slate-200 px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-sm text-center">
              <p className="text-2xl md:text-3xl font-bold text-blue-600">{perfil?.materiasTotal || "0"}</p>
              <p className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</p>
            </div>

            {/* CUADRO: Porcentaje de Avance */}
            <div className="bg-white border border-slate-200 px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-sm text-center flex-grow md:flex-grow-0 min-w-[120px]">
              <p className="text-2xl md:text-3xl font-bold text-blue-600">{porcentajeAvance > 100 ? 100 : porcentajeAvance}%</p>
              <p className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">De Avance</p>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${porcentajeAvance > 100 ? 100 : porcentajeAvance}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Botones de Navegación Rápidos */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <button 
              onClick={() => irASeccion('proyectos')}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition shadow-md"
            >
              Mis Proyectos
            </button>
            <button 
              onClick={() => irASeccion('certificados')}
              className="bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:border-blue-600 hover:text-blue-600 transition shadow-sm"
            >
              Mis Certificados
            </button>
          </div>

          {/* Resumen "Sobre mí" acortado */}
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 text-left">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">Sobre mí</h3>
            {/* line-clamp-3 oculta el texto que pase de 3 líneas */}
            <p className="text-slate-600 text-sm md:text-base line-clamp-3">
              {perfil?.quienSoy || "Tu descripción aquí."}
            </p>
            <button 
              onClick={() => setVerSobreMi(true)}
              className="mt-3 text-blue-600 font-bold text-sm hover:underline"
            >
              Leer más &rarr;
            </button>
          </div>
        </div>
      </header>

      {/* VENTANA EMERGENTE (MODAL) SOBRE MÍ */}
      {verSobreMi && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-8 text-left">
            <button 
              onClick={() => setVerSobreMi(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-bold flex items-center justify-center transition"
            >
              ✕
            </button>
            
            <h3 className="text-2xl md:text-3xl font-extrabold text-blue-600 mb-4 mt-4">¿Quién soy?</h3>
            <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed">
              {perfil?.quienSoy || "Tu descripción aquí."}
            </p>
            
            <h3 className="text-2xl md:text-3xl font-extrabold text-blue-600 mb-4">¿Quién quiero ser?</h3>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed">
              {perfil?.quienQuieroSer || "Tus metas aquí."}
            </p>
          </div>
        </div>
      )}

      {/* SECCIÓN LENGUAJES Y HERRAMIENTAS */}
      <section className="bg-white py-12 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-5 text-center">
          <h2 className="text-2xl font-bold mb-8 text-slate-700">Lenguajes y Herramientas que manejo</h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {lenguajes.map((lang) => (
              <div key={lang.id} className="flex flex-col items-center gap-2 group cursor-default w-20 md:w-24">
                <i className={`${lang.icono} text-4xl md:text-5xl text-slate-400 group-hover:text-blue-600 transition-colors duration-300`}></i>
                <span className="text-xs md:text-sm font-semibold text-slate-500 group-hover:text-slate-800 text-center">
                  {lang.nombre}
                </span>
                {lang.nivel && (
                  <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-md mt-1">
                    {lang.nivel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN PROYECTOS (Con ID para navegar y solo 2 columnas máximo para hacerlos grandes) */}
      <section id="proyectos" className="bg-slate-100 py-20 md:py-24 px-5">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Mis Proyectos</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-base md:text-lg">
              Una colección de aplicaciones en las que he trabajado, aplicando mis conocimientos en código, diseño y bases de datos.
            </p>
          </div>

          {/* Grid de 1 columna en móvil, 2 columnas en PC para tarjetas más grandes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {proyectos.map(proyecto => (
              <div key={proyecto.id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-200 flex flex-col h-full">
                
                <div className="relative h-56 md:h-64 overflow-hidden bg-slate-200">
                  <img 
                    src={(proyecto.imagenesUrl && proyecto.imagenesUrl[0]) || proyecto.imagenUrl || "https://via.placeholder.com/600x400?text=Proyecto"} 
                    alt={proyecto.titulo} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">{proyecto.titulo}</h3>
                  <p className="text-slate-500 mb-6 text-base flex-grow">
                    {proyecto.descripcionBreve || "Descripción breve del proyecto no disponible."}
                  </p>
                  
                  <button 
                    onClick={() => {
                      setProyectoSeleccionado(proyecto);
                      setImgIndex(0);
                    }}
                    className="w-full bg-slate-900 text-white py-3 md:py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors text-lg"
                  >
                    Ver detalles del proyecto &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN CERTIFICACIONES (Con ID para navegar y 2 columnas para tarjetas más grandes) */}
      <section id="certificados" className="max-w-4xl mx-auto py-20 px-5">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-slate-800">Mis Certificaciones</h2>
        
        {/* Grid de 1 columna en móvil, 2 en PC para tarjetas más grandes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map(cert => (
            <button 
              key={cert.id} 
              onClick={() => { setCertSeleccionado(cert); setVerArchivo(false); }}
              className="text-left bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm hover:border-blue-500 hover:shadow-lg transition-all group"
            >
              <h4 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition-colors mb-2">{cert.titulo}</h4>
              <p className="text-slate-500 mt-1 font-medium">Ver detalles del certificado &rarr;</p>
            </button>
          ))}
        </div>
      </section>

      {/* VENTANA EMERGENTE (MODAL) PARA CERTIFICADOS */}
      {certSeleccionado && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-6 md:p-8 text-center">
            
            <button 
              onClick={() => setCertSeleccionado(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-bold flex items-center justify-center transition"
            >
              ✕
            </button>

            {!verArchivo ? (
              <div className="text-left mt-4 space-y-4">
                <h3 className="text-2xl md:text-3xl font-extrabold text-blue-600 mb-6">{certSeleccionado.titulo}</h3>
                <p className="text-slate-600 text-base md:text-lg"><strong>Descripción:</strong> {certSeleccionado.descripcion}</p>
                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase font-bold">Duración</p>
                    <p className="text-lg font-semibold">{certSeleccionado.duracion}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p className="text-xs text-slate-400 uppercase font-bold">Año</p>
                    <p className="text-lg font-semibold">{certSeleccionado.año}</p>
                  </div>
                </div>
                
                {certSeleccionado.archivoUrl && (
                  <button 
                    onClick={() => setVerArchivo(true)}
                    className="w-full mt-4 bg-blue-600 text-white font-bold py-3 md:py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 text-lg"
                  >
                    Ver Documento del Certificado
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center">
                <button 
                  onClick={() => setVerArchivo(false)}
                  className="mb-4 text-slate-500 hover:text-slate-800 font-semibold"
                >
                  &larr; Volver a detalles
                </button>
                <div 
                  className="border-4 border-slate-100 rounded-lg overflow-hidden select-none w-full flex justify-center bg-slate-50"
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <img 
                    src={certSeleccionado.archivoUrl} 
                    alt="Certificado" 
                    className="max-h-[60vh] object-contain pointer-events-none" 
                  />
                </div>
                <p className="text-xs text-slate-400 mt-4">* Documento protegido. Prohibida su descarga.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VENTANA EMERGENTE (MODAL) DEL PROYECTO */}
      {proyectoSeleccionado && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-10">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row">
            
            <button 
              onClick={() => setProyectoSeleccionado(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-bold flex items-center justify-center transition z-10"
            >
              ✕
            </button>

            <div className="w-full md:w-1/2 bg-slate-100 relative min-h-[250px] md:min-h-[400px] flex items-center justify-center">
              {proyectoSeleccionado.imagenesUrl && proyectoSeleccionado.imagenesUrl.length > 0 ? (
                <>
                  <img 
                    src={proyectoSeleccionado.imagenesUrl[imgIndex]} 
                    alt="Captura del proyecto" 
                    className="w-full h-full object-contain max-h-[300px] md:max-h-[500px]"
                  />
                  {proyectoSeleccionado.imagenesUrl.length > 1 && (
                    <>
                      <button 
                        onClick={() => setImgIndex(imgIndex === 0 ? proyectoSeleccionado.imagenesUrl.length - 1 : imgIndex - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full hover:bg-black"
                      >
                        &#10094;
                      </button>
                      <button 
                        onClick={() => setImgIndex(imgIndex === proyectoSeleccionado.imagenesUrl.length - 1 ? 0 : imgIndex + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white w-8 h-8 rounded-full hover:bg-black"
                      >
                        &#10095;
                      </button>
                      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
                        {proyectoSeleccionado.imagenesUrl.map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i === imgIndex ? 'bg-blue-600' : 'bg-white/50'}`}></div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <img src={proyectoSeleccionado.imagenUrl} alt="Proyecto" className="w-full h-full object-contain max-h-[300px] md:max-h-[500px]" />
              )}
            </div>

            <div className="w-full md:w-1/2 p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">{proyectoSeleccionado.titulo}</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">{proyectoSeleccionado.descripcionCompleta || proyectoSeleccionado.descripcion}</p>
              </div>

              {proyectoSeleccionado.estructura && (
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Estructura / Arquitectura</h4>
                  <p className="text-slate-700 font-medium text-sm md:text-base">{proyectoSeleccionado.estructura}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Lenguajes / Frameworks</h4>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(proyectoSeleccionado.tecnologias) && proyectoSeleccionado.tecnologias.map((tech, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded">{tech}</span>
                    ))}
                  </div>
                </div>
                
                {proyectoSeleccionado.basesDeDatos && (
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Bases de Datos</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(proyectoSeleccionado.basesDeDatos) && proyectoSeleccionado.basesDeDatos.map((db, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded">{db}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-3">
                {proyectoSeleccionado.linkVisitar && (
                  <a href={proyectoSeleccionado.linkVisitar} target="_blank" rel="noreferrer" className="flex-1 bg-blue-600 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700 transition min-w-[120px] text-sm md:text-base">
                    <i className="fa-solid fa-globe mr-2"></i>Visitar Web
                  </a>
                )}
                {proyectoSeleccionado.linkDescarga && (
                  <a href={proyectoSeleccionado.linkDescarga} target="_blank" rel="noreferrer" className="flex-1 bg-emerald-600 text-white text-center py-3 rounded-xl font-bold hover:bg-emerald-700 transition min-w-[120px] text-sm md:text-base">
                    <i className="fa-solid fa-download mr-2"></i>Descargar APK
                  </a>
                )}
                {proyectoSeleccionado.linkCodigo && (
                  <a href={proyectoSeleccionado.linkCodigo} target="_blank" rel="noreferrer" className="flex-1 bg-slate-900 text-white text-center py-3 rounded-xl font-bold hover:bg-slate-800 transition min-w-[120px] text-sm md:text-base">
                    <i className="fa-brands fa-github mr-2"></i>Ver Código
                  </a>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white text-center py-8">
        <p>© {new Date().getFullYear()} {perfil?.nombre}. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
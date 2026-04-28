import { useState, useEffect } from "react";
import './App.css';


function App() {

  const [tareas, setTareas] = useState([]);
  const [textoInput, setTextoInput] = useState("");

  const agregarTarea = () => {
    if (textoInput.trim() === "") return;
    // Creamos la tarea como objeto
    const nueva = { texto: textoInput, completada: false };
    setTareas([...tareas, nueva]);
    setTextoInput("");
  };

  const tacharTarea = (index) => {
    const nuevas = [...tareas];
    nuevas[index].completada = !nuevas[index].completada;
    setTareas(nuevas);
  };

  const borrarTarea = (index) => {
    const filtradas = tareas.filter((_, i) => i !== index);
    setTareas(filtradas);
  };

 const limpiarTodo = () => {
  const confirmacion = window.confirm("¿Estás seguro de que querés borrar TODA la lista?");
  
  if (confirmacion) {
    setTareas([]);
    alert("Lista vaciada con éxito");
  } else {
    alert("Uff, ¡casi las borramos!");
  }
};
const total = tareas.length;
const completadas = tareas.filter(t => t.completada).length;
const pendientes = total - completadas;

useEffect(() => {
  // 1. Definimos la función que busca los datos
  const obtenerTareas = async () => {
    try {
      const respuesta = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=15"); // Traemos solo 10 para que no sea un lío
      const datos = await respuesta.json();
      
      // 2. Adaptamos los datos: JSONPlaceholder trae "title" y "completed"
      // Nosotros veníamos usando "texto" y "completada"
      const tareasAdaptadas = datos.map(item => ({
        texto: item.title,
        completada: item.completed
      }));

      // 3. Guardamos todo en nuestro estado
      setTareas(tareasAdaptadas);
    } catch (error) {
      console.error("Error al buscar tareas:", error);
    }
  };

  obtenerTareas();
}, []); // El [] vacío significa: "hacé esto una sola vez al cargar"

return (
  <div style={{ textAlign: 'center', marginTop: '50px'}}>
    <h1>Mi lista de tareas</h1>
    
    {/* Sección de estadísticas */}
    <div style={{ display: 'flex', justifyContent:'center', marginBottom: '20px', gap:'10px' }}>
      <p>Total: <strong>{total}</strong></p>
      <p>Completadas: <span style={{ color: 'green' }}>{completadas}</span></p>
      <p>Pendientes: <span style={{ color: 'orange' }}>{pendientes}</span></p>
    </div>
 
      <div className="separador">
        <input
          type="text" 
          value={textoInput} 
          onChange={(e) => setTextoInput(e.target.value)}
          onKeyDown={(e) => {
    if (e.key === "Enter") {
      agregarTarea();
    }
  }}
          placeholder="Escribí aquí una tarea..."
        />
        <button onClick={agregarTarea}>Agregar</button>

     
      {tareas.length > 0 && (
        <button 
        onClick={limpiarTodo} 
        style={{backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer', marginLeft:'380px' }}
        >
          Borrar todas
        </button>
      )}
{/* Si el largo de tareas es 0, mostramos el H1 */}
{tareas.length === 0 && (
  <h3 style={{ color: 'gray', marginTop: '20px' }}>
    Aún no se ingresaron tareas
  </h3>
)}      </div>

      <ul style={{ listStyle: 'none', padding: '10px', marginTop: '40px'}}>
        {tareas.map((t, index) => (
         
         <li key={index} style={{ 
  marginBottom: '10px', 
  padding: '10px', 
  border: '1px solid black', 
  borderRadius: '20px',
  // --- AGREGAMOS ESTO ---
  display: 'flex', 
  alignItems: 'center',        // Centra verticalmente texto y botones
  justifyContent: 'space-between' // Texto a la izquierda, botones a la derecha
}}>
  
  <span style={{ 
    textDecoration: t.completada ? 'line-through' : 'none',
    marginRight: '10px',
    textAlign: 'left',
    flex: 1 // Esto hace que el texto ocupe todo el espacio sobrante
  }}>
    {t.texto}
  </span>

  {/* Envolvemos los botones en un div para que se mantengan juntos a la derecha */}
  <div>
    <button onClick={() => tacharTarea(index)}>Tachar</button>
    <button onClick={() => borrarTarea(index)} style={{ marginLeft: '25px', color:'white', background:'red' }}>Borrar</button>
  </div>

</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
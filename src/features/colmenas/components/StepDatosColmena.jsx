import React, { useState, useEffect } from 'react';
import Button from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { useNavigate } from 'react-router-dom';
import { createColmena } from '../services/create_colmenas';
import { useColmenaForm } from '../hooks/useColmenaForm';
import { useDeleteColmena } from '../hooks/useDeleteColmena';
import ModalConfirmacionEliminarColmena from './modals/ModalConfirmacionEliminarColmena';
import { updateColmena } from '../services/update_colmena';
import { getColmenaById } from '../services/get_colmena_byID';
import ToastMessage from '../../../shared/components/Modals/ToastMessage';
import { validarDatosColmena } from '../utils/validadacionesColmena';

const StepDatosColmena = ({ onColmenaCreada }) => {
  const navigate = useNavigate();
  const { deleteColmena } = useDeleteColmena();
  const [modalVisible, setModalVisible] = useState(false);
  const [showToast, setShowToast] = useState(false); // New state for toast visibility
  const [toastMessage, setToastMessage] = useState({ type: '', title: '', message: '' }); // New state for toast content

  const {
    colmenaId,
    setColmenaId,
    nombreColmena,
    setNombreColmena,
    areaUbicacion,
    setAreaUbicacion,
    tipoColmena,
    setTipoColmena,
    mac,
    setMac,
    handleSensorChange,
    resetForm,
    modoEdicion,
    setModoEdicion,
  } = useColmenaForm();

  const formState = {
    colmenaId,
    setColmenaId,
    nombreColmena,
    setNombreColmena,
    areaUbicacion,
    setAreaUbicacion,
    tipoColmena,
    setTipoColmena,
    handleSensorChange,
    modoEdicion,
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Validar campos antes de enviar
  const errores = validarDatosColmena({
    colmenaId,
    nombreColmena,
    areaUbicacion,
    tipoColmena,
    mac,
  });

  if (errores.length > 0) {
    setToastMessage({
      type: 'error',
      title: 'Campos inválidos',
      message: errores[0],
    });
    setShowToast(true);
    return;
  }

  const id_usuario = sessionStorage.getItem('user_id');
  if (!id_usuario) return alert('No se ha encontrado el ID del usuario.');

  const data = {
    identificador: colmenaId,
    nombre: nombreColmena,
    area_ubicacion: areaUbicacion,
    tipo_colmena: tipoColmena || 'Langstroth',
    mac_raspberry: mac,
    estado: 'activo',
    id_usuario: Number(id_usuario),
  };

  try {
    if (formState.modoEdicion) {
      const colmenaIdExistente = sessionStorage.getItem('id_colmena');
      if (!colmenaIdExistente) return alert('No se encontró ID de colmena para editar.');

      await updateColmena(Number(colmenaIdExistente), data);
      setToastMessage({
        type: 'success',
        title: '¡Colmena actualizada!',
        message: 'Los cambios en tu colmena han sido guardados.'
      });
      setShowToast(true);

      setTimeout(() => {
        onColmenaCreada(Number(colmenaIdExistente));
      }, 1000);
    } else {
      const response = await createColmena(data);
      if (response?.data?.id) {
        sessionStorage.setItem('id_colmena', response.data.id);
        setToastMessage({
          type: 'success',
          title: '¡Colmena guardada!',
          message: 'Ya tienes una nueva colmena en tu enjambre.'
        });
        setShowToast(true);

        setTimeout(() => {
          onColmenaCreada(response.data.id);
        }, 1000);
      } else {
        alert('No se recibió ID de colmena después de crearla.');
      }
    }
  } catch (error) {
    console.error('Error al guardar la colmena:', error);
    setToastMessage({
      type: 'error',
      title: 'Error al guardar',
      message: 'Ocurrió un error al guardar la colmena. Por favor, inténtalo de nuevo.'
    });
    setShowToast(true);
  }
};


  const handleCancelar = async () => {
    if (!modoEdicion) {
      const colmenaIdToDelete = sessionStorage.getItem('id_colmena');
      if (colmenaIdToDelete) {
        try {
          await deleteColmena(Number(colmenaIdToDelete));
          console.log(`Colmena con ID ${colmenaIdToDelete} eliminada al cancelar la creación.`);
        } catch (err) {
          console.error('Error al cancelar creación y eliminar colmena:', err);
          alert('Error al cancelar la creación y eliminar la colmena. Intente de nuevo.');
        }
      }
    } else {
      console.log('Cancelando edición sin eliminar la colmena.');
    }

    resetForm();
    sessionStorage.removeItem('paso');
    sessionStorage.removeItem('id_colmena');
    sessionStorage.removeItem('modoEdicion');
    navigate('/colmenas');
  };

  useEffect(() => {
    const fetchColmena = async () => {
      if (!modoEdicion) return;

      const colmenaIdExistente = sessionStorage.getItem('id_colmena');
      if (!colmenaIdExistente) return;

      try {
        const data = await getColmenaById(Number(colmenaIdExistente));

        setColmenaId(data.identificador || '');
        setNombreColmena(data.nombre || '');
        setAreaUbicacion(data.area_ubicacion || '');
        setTipoColmena(data.tipo_colmena || 'Langstroth');
        setMac(data.mac_raspberry || '');
      } catch (error) {
        console.error('❌ Error al cargar datos de colmena:', error);
        alert('Ocurrió un error al cargar la colmena para editar.');
      }
    };

    fetchColmena();
  }, [modoEdicion]);

  // Function to close the toast message
  const handleCloseToast = () => {
    setShowToast(false);
    setToastMessage({ type: '', title: '', message: '' }); // Clear message
  };

  useEffect(() => {
  if (showToast) {
    const timer = setTimeout(() => {
      setShowToast(false);
      setToastMessage({ type: '', title: '', message: '' });
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [showToast]);


return (
  <>
    {/* ✅ Toast fuera del contenedor principal */}
    {showToast && (
      <ToastMessage
        type={toastMessage.type}
        title={toastMessage.title}
        message={toastMessage.message}
        onClose={handleCloseToast}
      />
    )}

    <div className="flex justify-center">
      <div className="relative p-6 sm:p-8 bg-[#0C3F72] rounded-lg shadow-2xl w-full max-w-6xl">
        <h1 className="text-white text-4xl font-bold mb-2">
          {modoEdicion ? 'Editando colmena' : '¡NUEVA COLMENA!'}
        </h1>
        <p className="text-white text-lg mb-8">
          {modoEdicion
            ? 'Modifica los datos de la colmena y guarda los cambios.'
            : 'Llena los siguientes datos para comenzar a trabajar con ella.'}
        </p>

        <form onSubmit={handleSubmit} className="relative pb-[0.16px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <Input
              label="Identificador de la colmena"
              name="identificador"
              value={colmenaId}
              onChange={(e) => setColmenaId(e.target.value)}
              placeholder="COL-001"
              labelClassName="text-white text-lg"
            />
            <Input
              label="Nombre de la colmena"
              name="nombreColmena"
              value={nombreColmena}
              onChange={(e) => setNombreColmena(e.target.value)}
              placeholder="Colmena Central"
              labelClassName="text-white text-lg"
            />
            <Input
              label="Área o ubicación"
              name="areaUbicacion"
              value={areaUbicacion}
              onChange={(e) => setAreaUbicacion(e.target.value)}
              placeholder="Zona Norte"
              labelClassName="text-white text-lg"
            />
            <Input
  label="MAC de la Raspberry"
  name="mac"
  value={mac}
  onChange={(e) => setMac(e.target.value)}
  placeholder="00:00:00:00:00:00"
  labelClassName="text-white text-lg"
  disabled={modoEdicion}
/>

            <Input
              label="Tipo de colmena"
              name="tipoColmena"
              type="select"
              value={tipoColmena}
              onChange={(e) => setTipoColmena(e.target.value)}
              options={[
                { value: 'Langstroth', label: 'Langstroth' },
                { value: 'Warre', label: 'Warre' },
                { value: 'Top-Bar', label: 'Top-Bar' },
              ]}
              labelClassName="text-white text-lg"
            />
          </div>

          <div className="mt-6 sm:absolute sm:bottom-4 sm:right-4 flex flex-col sm:flex-row gap-4 sm:justify-end w-full sm:w-auto p-4 sm:p-0">
            <Button
              type="button"
              variant='secondary'
              fullWidth=""
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setModalVisible(true)}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="secondary">
              {formState.modoEdicion ? 'Actualizar y continuar' : 'Guardar y continuar'}
            </Button>
          </div>
        </form>
      </div>

      <ModalConfirmacionEliminarColmena
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onConfirm={handleCancelar}
  nombre={nombreColmena}
  area={areaUbicacion}
  tipo={tipoColmena}
  mensajeCustom={
    modoEdicion
      ? "¿Estás seguro que deseas cancelar la edición? Los cambios no guardados se perderán."
      : "¿Estás seguro que deseas cancelar la creación de la colmena? Se eliminarán todos los datos ingresados."
  }
/>

    </div>
  </>
);

};

export default StepDatosColmena;
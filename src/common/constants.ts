export enum EstadoTarea {
  PENDIENTE = 'pendiente',
  COMPLETADA = 'completada',
}

export enum PrioridadTarea {
  ALTA = 'Alta',
  MEDIA = 'Media',
  BAJA = 'Baja',
}

export enum CategoriaGasto {
  ALIMENTACION = 'Alimentación',
  TRANSPORTE = 'Transporte',
  SERVICIOS = 'Servicios',
  COMPRAS = 'Compras',
  PAPELERIA = 'Papelería',
  ENTRETENIMIENTO = 'Entretenimiento',
  OTROS = 'Otros',
}

export const CATEGORIAS_GASTO = Object.values(CategoriaGasto);

export const CATEGORIAS_GASTO_DETALLE: { nombre: string; descripcion: string }[] =
  [
    {
      nombre: CategoriaGasto.ALIMENTACION,
      descripcion: 'Alimentos, bebidas y abastecimiento relacionados con el hotel.',
    },
    {
      nombre: CategoriaGasto.TRANSPORTE,
      descripcion: 'Desplazamientos, combustible y transporte operativo.',
    },
    {
      nombre: CategoriaGasto.SERVICIOS,
      descripcion: 'Servicios públicos y contratados (agua, energía, internet, etc.).',
    },
    {
      nombre: CategoriaGasto.COMPRAS,
      descripcion: 'Adquisición de insumos y elementos para la operación.',
    },
    {
      nombre: CategoriaGasto.PAPELERIA,
      descripcion: 'Material de oficina y papelería administrativa.',
    },
    {
      nombre: CategoriaGasto.ENTRETENIMIENTO,
      descripcion: 'Actividades o elementos de entretenimiento para huéspedes.',
    },
    {
      nombre: CategoriaGasto.OTROS,
      descripcion: 'Gastos que no corresponden a las demás categorías.',
    },
  ];

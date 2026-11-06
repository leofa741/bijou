'use client';

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { siteConfig } from '@/app/lib/config';

// Registrar fuente Helvetica para máxima compatibilidad en PDFs
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/helvetica/v12/HELVETICA.woff', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/helvetica/v12/HELVETICA_BOLD.woff', fontWeight: 'bold' }
  ]
});

// ✅ INTERFAZ CORREGIDA: mensajevalidez es opcional (?)
interface ConfigType {
  titulo: string;
  labelTotal: string;
  mensajeCierre: string;
  validez: string;
  mensajevalidez?: string; 
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF', // Fondo blanco puro para impresión limpia
    padding: 40,
    fontFamily: 'Helvetica',
  },
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: 250,
    opacity: 0.04, // Muy sutil, como una marca de agua de lujo
    transform: 'rotate(-15deg)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: 1,
    borderColor: '#E8DFD0', // Borde crema suave
    paddingBottom: 20,
  },
  logo: {
    width: 70,
    height: 'auto',
  },
  brandContainer: {
    alignItems: 'flex-end',
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3D2B1F', // Cacao oscuro
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 8,
    color: '#8B6F47', // Marrón cálido
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  clientSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  clientBox: {
    backgroundColor: '#F5F3FF', // Lilá muy suave y elegante
    padding: 15,
    borderRadius: 6,
    width: '45%',
    border: '1pt solid #E8DFD0',
  },
  label: {
    fontSize: 8,
    color: '#8B6F47',
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 11,
    color: '#3D2B1F',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  textLight: {
    fontSize: 10,
    color: '#6B5B4F',
    marginBottom: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: '#C9A961', // Acento dorado champagne
    paddingBottom: 8,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 8,
    color: '#8B6F47',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: '#E8DFD0',
    paddingVertical: 10,
    fontSize: 10,
    color: '#3D2B1F',
  },
  colDesc: { width: '50%' },
  colQty: { width: '15%', textAlign: 'center' },
  colPrice: { width: '20%', textAlign: 'right' },
  colTotal: { width: '15%', textAlign: 'right', fontWeight: 'bold', color: '#3D2B1F' },
  
  totalSection: {
    marginTop: 30,
    alignItems: 'flex-end',
  },
  totalBox: {
    backgroundColor: '#FFFFFF',
    border: '1pt solid #C9A961', // Borde dorado elegante
    borderRadius: 6,
    padding: 20,
    width: '45%',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  totalLabel: {
    fontSize: 9,
    color: '#8B6F47',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3D2B1F',
    letterSpacing: -0.5,
  },

  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTop: 1,
    borderColor: '#C9A961', // Línea dorada
    paddingTop: 15,
  },
  footerMessage: {
    fontSize: 11,
    color: '#3D2B1F',
    fontWeight: 'bold',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  footerValidity: {
    fontSize: 9,
    color: '#8B6F47',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 8,
    color: '#6B5B4F',
    letterSpacing: 0.5,
  },
});

interface PedidoPDFProps {
  pedido: any;
  tipo?: 'pedido' | 'presupuesto';
}

export const PedidoPDF = ({ pedido, tipo = 'pedido' }: PedidoPDFProps) => {
  // ✅ Definimos el tipo explícitamente para que TypeScript sepa que mensajevalidez es opcional
  const config: Record<'pedido' | 'presupuesto', ConfigType> = {
    pedido: {
      titulo: 'ORDEN DE PEDIDO',
      labelTotal: 'TOTAL A PAGAR',
      mensajeCierre: '¡Gracias por confiar en nosotros para hacer tus momentos especiales!',
      validez: 'Pago al retirar',
    },
    presupuesto: {
      titulo: 'PRESUPUESTO',
      labelTotal: 'TOTAL PRESUPUESTADO',
      mensajeCierre: '¡Gracias por considerar nuestros servicios artesanales!',
      mensajevalidez: 'Este presupuesto es válido por 15 días. Esperamos tu confirmación.',
      validez: 'Válido por: 15 días',
    },
  };

  const current = config[tipo];
  
  const total = pedido?.productos?.reduce((acc: number, prod: any) => {
    const precio = prod.precioUnitario || prod.precio || 0;
    return acc + (prod.cantidad * precio);
  }, 0) || pedido?.total || 0;

  const logoSrc = siteConfig.logo ;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Marca de agua sutil */}
        <Image style={styles.watermark} src={logoSrc.src} />

        {/* Encabezado */}
        <View style={styles.header}>
          <Image style={styles.logo} src={logoSrc.src} />
          <View style={styles.brandContainer}>
            <Text style={styles.brandName}>{siteConfig.companyName}</Text>
            <Text style={styles.brandSubtitle}>Productos Personalizados con Amor</Text>
          </View>
        </View>

        {/* Información del Cliente y del Documento */}
        <View style={styles.clientSection}>
          <View style={styles.clientBox}>
            <Text style={styles.label}>Cliente</Text>
            <Text style={styles.text}>{pedido.clienteNombre || 'Cliente'}</Text>
            <Text style={styles.textLight}>{pedido.clienteEmail || 'Sin email registrado'}</Text>
            <Text style={styles.textLight}>{pedido.clienteTelefono || 'Sin teléfono'}</Text>
          </View>
          
          <View style={{ width: '45%', alignItems: 'flex-end' }}>
            <Text style={[styles.label, { fontSize: 10, color: '#3D2B1F' }]}>
              {current.titulo} N° {pedido._id ? pedido._id.slice(-6).toUpperCase() : '000000'}
            </Text>
            <Text style={[styles.textLight, { marginTop: 6, fontSize: 11 }]}>
              Fecha: {pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString('es-AR') : new Date().toLocaleDateString('es-AR')}
            </Text>
            <Text style={[styles.textLight, { marginTop: 4, fontSize: 11, fontWeight: 'bold', color: '#8B6F47' }]}>
              {current.validez}
            </Text>
          </View>
        </View>

        {/* Tabla de Productos */}
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Descripción</Text>
          <Text style={styles.colQty}>Cant.</Text>
          <Text style={styles.colPrice}>Precio Unit.</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {pedido.productos?.map((prod: any, index: number) => {
          const precio = prod.precioUnitario || prod.precio || 0;
          const subtotal = prod.cantidad * precio;
          
          return (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 0 ? { backgroundColor: '#FAF7F2' } : { backgroundColor: '#FFFFFF' }
              ]}
            >
              <Text style={styles.colDesc}>{prod.nombre || 'Producto'}</Text>
              <Text style={styles.colQty}>{prod.cantidad || 0}</Text>
              <Text style={styles.colPrice}>${precio.toLocaleString('es-AR')}</Text>
              <Text style={styles.colTotal}>${subtotal.toLocaleString('es-AR')}</Text>
            </View>
          );
        })}

        {/* Totales */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>{current.labelTotal}</Text> 
            <Text style={styles.totalAmount}>${total.toLocaleString('es-AR')}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerMessage}>{current.mensajeCierre}</Text>
          
          {/* ✅ Ahora TypeScript sabe que esto es seguro gracias a la interfaz ConfigType */}
          {current.mensajevalidez && (
            <Text style={styles.footerValidity}>{current.mensajevalidez}</Text>
          )} 
          
          <Text style={styles.footerText}>
            {siteConfig.companyName} • {siteConfig.companyUrl} • {siteConfig.whatsapp} • {siteConfig.email}
          </Text>
        </View>

      </Page>
    </Document>
  );
};
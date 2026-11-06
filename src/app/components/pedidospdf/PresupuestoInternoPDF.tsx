'use client';

import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import {siteConfig} from '@/app/lib/config';

// Registrar fuente Helvetica (nativa de @react-pdf/renderer)
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/helvetica/v12/HELVETICA.woff', fontWeight: 'normal' },
        { src: 'https://fonts.gstatic.com/s/helvetica/v12/HELVETICA_BOLD.woff', fontWeight: 'bold' }
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        backgroundColor: '#FAF7F2', // Fondo crema premium
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 30,
        borderBottom: 1,
        borderColor: '#E8DFD0', // Borde crema suave
        paddingBottom: 20,
    },
    brandContainer: {
        flexDirection: 'column',
    },
    brandName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#3D2B1F', // Cacao oscuro
        letterSpacing: 0.5,
        marginTop: 8,
    },
    brandSubtitle: {
        fontSize: 9,
        color: '#8B6F47', // Marrón cálido
        marginTop: 4,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    logo: {
        width: 60,
        height: 'auto',
        marginBottom: 4,
    },
    projectInfo: {
        alignItems: 'flex-end',
    },
    projectTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3D2B1F',
        marginBottom: 4,
    },
    projectDate: {
        fontSize: 9,
        color: '#6B5B4F',
        letterSpacing: 0.5,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#3D2B1F',
        marginBottom: 12,
        marginTop: 10,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
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
        paddingVertical: 8,
        fontSize: 9,
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
        border: '1pt solid #C9A961', // Borde dorado
        borderRadius: 6,
        padding: 20,
        width: '50%',
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: 8,
        color: '#8B6F47',
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3D2B1F',
    },
    totalDivider: {
        width: '100%',
        height: 1,
        backgroundColor: '#E8DFD0',
        marginVertical: 12,
    },
    totalLabelFinal: {
        fontSize: 9,
        color: '#C9A961', // Etiqueta dorada
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    totalAmountFinal: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3D2B1F',
    },
    notesBox: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#F5F3FF', // Lilá muy suave
        borderRadius: 6,
        border: '1pt solid #D4B5D4', // Borde lilá
    },
    notesTitle: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#8B6F47',
        marginBottom: 6,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    notesText: {
        fontSize: 9,
        color: '#3D2B1F',
        lineHeight: 1.6,
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
        fontSize: 8,
        color: '#8B6F47',
        letterSpacing: 0.5,
    },
    manualBadge: {
        fontSize: 7,
        color: '#8B6F47',
        backgroundColor: '#F5EFE6', // Crema
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 3,
        marginLeft: 6,
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: '#E8DFD0',
    },
});

interface InsumoPDF {
    nombre: string;
    unidadMedida: string;
    costoUnitario: number;
    cantidad: number;
    subtotal: number;
    esPersonalizado?: boolean;
}

interface DatosPresupuesto {
    nombreProyecto: string;
    notasInternas?: string;
    insumos: InsumoPDF[];
    costoTotal: number;
    precioFinal: number;
    margenGanancia?: number;
    fecha: string;
}

export const PresupuestoInternoPDF = ({ datos }: { datos: DatosPresupuesto }) => {
    const logoSrc = siteConfig.logo ;

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Encabezado Unificado y Limpio */}
                <View style={styles.header}>
                    <View style={styles.brandContainer}>
                        <Image style={styles.logo} src={logoSrc.src} />
                        <Text style={styles.brandName}>{siteConfig.companyName}</Text>
                        <Text style={styles.brandSubtitle}>Presupuesto Interno de Costos</Text>
                    </View>
                    <View style={styles.projectInfo}>
                        <Text style={styles.projectTitle}>{datos.nombreProyecto}</Text>
                        <Text style={styles.projectDate}>{datos.fecha}</Text>
                    </View>
                </View>

                {/* Tabla de Insumos */}
                <Text style={styles.sectionTitle}>Desglose de Materiales y Costos</Text>

                <View style={styles.tableHeader}>
                    <Text style={styles.colDesc}>Descripción</Text>
                    <Text style={styles.colQty}>Cant.</Text>
                    <Text style={styles.colPrice}>Costo Unit.</Text>
                    <Text style={styles.colTotal}>Subtotal</Text>
                </View>

                {datos.insumos.map((prod, index) => (
                    <View
                        key={index}
                        style={[
                            styles.tableRow,
                            index % 2 === 0 ? { backgroundColor: '#FFFFFF' } : { backgroundColor: '#FAF7F2' }
                        ]}
                    >
                        <View style={styles.colDesc}>
                            {/* Anidar Text dentro de Text es la forma correcta y segura en @react-pdf/renderer */}
                            <Text>
                                {prod.nombre}
                                {prod.esPersonalizado && (
                                    <Text style={styles.manualBadge}> MANUAL</Text>
                                )}
                            </Text>
                        </View>
                        <Text style={styles.colQty}>{prod.cantidad}</Text>
                        <Text style={styles.colPrice}>${prod.costoUnitario.toLocaleString('es-AR')}</Text>
                        <Text style={styles.colTotal}>${prod.subtotal.toLocaleString('es-AR')}</Text>
                    </View>
                ))}

                {/* Totales */}
                <View style={styles.totalSection}>
                    <View style={styles.totalBox}>
                        <Text style={styles.totalLabel}>Costo Total de Producción</Text>
                        <Text style={styles.totalAmount}>${datos.costoTotal.toLocaleString('es-AR')}</Text>

                        <View style={styles.totalDivider} />

                        <Text style={styles.totalLabelFinal}>
                            Precio Final Sugerido
                        </Text>
                        <Text style={styles.totalAmountFinal}>
                            ${datos.precioFinal.toLocaleString('es-AR')}
                        </Text>
                    </View>
                </View>

                {/* Notas Internas */}
                {datos.notasInternas && (
                    <View style={styles.notesBox}>
                        <Text style={styles.notesTitle}>📝 Notas Internas</Text>
                        <Text style={styles.notesText}>{datos.notasInternas}</Text>
                    </View>
                )}

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>Documento generado para uso interno · {siteConfig.companyName}</Text>
                    <Text style={{ marginTop: 4 }}>{siteConfig.companyUrl}</Text>
                </View>

            </Page>
        </Document>
    );
};
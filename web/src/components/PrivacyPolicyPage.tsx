import { ArrowLeft } from 'lucide-react';
import { Link } from './Link';

interface PrivacyPolicyPageProps {
  language: 'es' | 'en';
}

export function PrivacyPolicyPage({ language }: PrivacyPolicyPageProps) {
  const content = {
    es: {
      title: 'Política de Privacidad',
      backToHome: 'Volver al Inicio',
      sections: [
        {
          title: '1. Responsable del Tratamiento',
          content: `La Fundación CUDECA (en adelante "CUDECA"), con CIF G-29532206 y domicilio en Calle Dehesa del Camarate 1, 29004 Málaga, es la responsable del tratamiento de sus datos personales.

Puede contactar con nosotros en:
- Email: info@cudeca.org
- Teléfono: +34 952 56 49 10
- Dirección postal: Calle Dehesa del Camarate 1, 29004 Málaga`
        },
        {
          title: '2. Finalidad del Tratamiento de Datos',
          content: `CUDECA tratará sus datos personales para las siguientes finalidades:

- Gestión de eventos: Procesar la compra de entradas, rifas y sorteos solidarios.
- Gestión de socios: Administrar las suscripciones y cuotas de los miembros de la fundación.
- Gestión de donaciones: Procesar y registrar las donaciones realizadas a favor de CUDECA.
- Emisión de certificados fiscales: Generar los certificados necesarios para deducciones fiscales.
- Comunicaciones: Enviar información sobre eventos, actividades y novedades de la fundación (únicamente si ha dado su consentimiento expreso).
- Cumplimiento legal: Atender las obligaciones legales y fiscales aplicables.`
        },
        {
          title: '3. Base Jurídica del Tratamiento',
          content: `El tratamiento de sus datos personales se basa en:

- Ejecución de un contrato: Cuando adquiere entradas, se hace socio o realiza donaciones.
- Consentimiento: Para el envío de comunicaciones comerciales y promocionales.
- Obligación legal: Para cumplir con las obligaciones fiscales y contables.
- Interés legítimo: Para la gestión y mejora de nuestros servicios.`
        },
        {
          title: '4. Datos Recopilados',
          content: `Podemos recopilar los siguientes tipos de datos personales:

- Datos de identificación: Nombre, apellidos, DNI/NIE.
- Datos de contacto: Email, teléfono, dirección postal.
- Datos de facturación: Dirección de facturación, código postal, ciudad.
- Datos de pago: Únicamente la información necesaria para procesar pagos mediante Tarjeta Bancaria, PayPal o Bizum (no almacenamos datos completos de tarjetas).
- Datos de navegación: Cookies y datos de uso de la web (ver Política de Cookies).`
        },
        {
          title: '5. Conservación de Datos',
          content: `Sus datos personales se conservarán durante:

- Socios activos: Mientras mantenga su suscripción activa y hasta 5 años después de la baja.
- Compra de entradas: Durante el tiempo necesario para la gestión del evento y hasta 5 años después para cumplir obligaciones fiscales.
- Donaciones: Hasta 5 años después de la donación para cumplir obligaciones fiscales.
- Comunicaciones comerciales: Hasta que retire su consentimiento.

Transcurridos estos plazos, sus datos serán eliminados o anonimizados.`
        },
        {
          title: '6. Destinatarios de los Datos',
          content: `Sus datos personales podrán ser comunicados a:

- Proveedores de servicios de pago: PayPal, Bizum y pasarelas de pago bancarias.
- Proveedores tecnológicos: Servicios de hosting, bases de datos y sistemas CRM.
- Administraciones públicas: Cuando exista una obligación legal (Agencia Tributaria, etc.).

Todos nuestros proveedores están obligados contractualmente a garantizar la seguridad y confidencialidad de sus datos.

No se realizarán transferencias internacionales de datos fuera del Espacio Económico Europeo.`
        },
        {
          title: '7. Derechos del Usuario',
          content: `Usted tiene derecho a:

- Acceso: Obtener confirmación sobre si estamos tratando sus datos personales.
- Rectificación: Corregir datos inexactos o incompletos.
- Supresión: Solicitar la eliminación de sus datos cuando ya no sean necesarios.
- Oposición: Oponerse al tratamiento de sus datos.
- Limitación: Solicitar la limitación del tratamiento.
- Portabilidad: Recibir sus datos en formato estructurado y de uso común.
- Revocación del consentimiento: Retirar el consentimiento en cualquier momento sin que afecte a la licitud del tratamiento anterior.

Para ejercer estos derechos, puede contactarnos en:
- Email: info@cudeca.org
- Dirección postal: Calle Dehesa del Camarate 1, 29004 Málaga

También tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si considera que el tratamiento no se ajusta a la normativa.`
        },
        {
          title: '8. Medidas de Seguridad',
          content: `CUDECA ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de sus datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado, teniendo en cuenta el estado de la tecnología, la naturaleza de los datos almacenados y los riesgos a los que están expuestos.

Utilizamos protocolos de cifrado SSL/TLS para la transmisión de datos, acceso restringido a la información, copias de seguridad periódicas y sistemas de autenticación seguros.`
        },
        {
          title: '9. Menores de Edad',
          content: `Los servicios de CUDECA están dirigidos a personas mayores de 18 años. No recopilamos intencionadamente datos de menores de edad. Si tiene conocimiento de que un menor ha proporcionado datos personales, por favor contáctenos para que procedamos a su eliminación.`
        },
        {
          title: '10. Modificaciones de la Política de Privacidad',
          content: `CUDECA se reserva el derecho a modificar esta Política de Privacidad para adaptarla a novedades legislativas, jurisprudenciales o de interpretación de la Agencia Española de Protección de Datos.

Cualquier modificación será publicada en esta página con suficiente antelación a su puesta en aplicación.`
        },
        {
          title: '11. Contacto',
          content: `Para cualquier duda, sugerencia o consulta sobre nuestra Política de Privacidad, puede contactarnos en:

Fundación CUDECA
Calle Dehesa del Camarate 1
29004 Málaga
Email: info@cudeca.org
Teléfono: +34 952 56 49 10`
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      backToHome: 'Back to Home',
      sections: [
        {
          title: '1. Data Controller',
          content: `CUDECA Foundation (hereinafter "CUDECA"), with Tax ID G-29532206 and registered address at Calle Dehesa del Camarate 1, 29004 Málaga, is the controller of your personal data.

You can contact us at:
- Email: info@cudeca.org
- Phone: +34 952 56 49 10
- Postal address: Calle Dehesa del Camarate 1, 29004 Málaga`
        },
        {
          title: '2. Purpose of Data Processing',
          content: `CUDECA will process your personal data for the following purposes:

- Event management: Process ticket, raffle, and charity draw purchases.
- Membership management: Administer memberships and member fees.
- Donation management: Process and record donations made to CUDECA.
- Tax certificate issuance: Generate necessary certificates for tax deductions.
- Communications: Send information about events, activities, and foundation news (only with your express consent).
- Legal compliance: Meet applicable legal and tax obligations.`
        },
        {
          title: '3. Legal Basis for Processing',
          content: `The processing of your personal data is based on:

- Contract execution: When you purchase tickets, become a member, or make donations.
- Consent: For sending commercial and promotional communications.
- Legal obligation: To comply with tax and accounting obligations.
- Legitimate interest: For managing and improving our services.`
        },
        {
          title: '4. Data Collected',
          content: `We may collect the following types of personal data:

- Identification data: Name, surname, ID number.
- Contact data: Email, phone, postal address.
- Billing data: Billing address, postal code, city.
- Payment data: Only the information necessary to process payments via Bank Card, PayPal, or Bizum (we do not store complete card data).
- Navigation data: Cookies and website usage data (see Cookie Policy).`
        },
        {
          title: '5. Data Retention',
          content: `Your personal data will be retained for:

- Active members: While your subscription is active and up to 5 years after cancellation.
- Ticket purchases: During the time necessary for event management and up to 5 years thereafter to meet tax obligations.
- Donations: Up to 5 years after the donation to meet tax obligations.
- Commercial communications: Until you withdraw your consent.

After these periods, your data will be deleted or anonymized.`
        },
        {
          title: '6. Data Recipients',
          content: `Your personal data may be disclosed to:

- Payment service providers: PayPal, Bizum, and bank payment gateways.
- Technology providers: Hosting services, databases, and CRM systems.
- Public administrations: When there is a legal obligation (Tax Agency, etc.).

All our providers are contractually obligated to guarantee the security and confidentiality of your data.

No international data transfers will be made outside the European Economic Area.`
        },
        {
          title: '7. User Rights',
          content: `You have the right to:

- Access: Obtain confirmation about whether we are processing your personal data.
- Rectification: Correct inaccurate or incomplete data.
- Erasure: Request deletion of your data when no longer necessary.
- Object: Object to the processing of your data.
- Restriction: Request restriction of processing.
- Portability: Receive your data in a structured, commonly used format.
- Withdraw consent: Withdraw consent at any time without affecting the lawfulness of previous processing.

To exercise these rights, you can contact us at:
- Email: info@cudeca.org
- Postal address: Calle Dehesa del Camarate 1, 29004 Málaga

You also have the right to file a complaint with the Spanish Data Protection Agency (www.aepd.es) if you believe the processing does not comply with regulations.`
        },
        {
          title: '8. Security Measures',
          content: `CUDECA has adopted the necessary technical and organizational measures to ensure the security of your personal data and prevent its alteration, loss, processing, or unauthorized access, taking into account the state of technology, the nature of stored data, and the risks to which they are exposed.

We use SSL/TLS encryption protocols for data transmission, restricted access to information, periodic backups, and secure authentication systems.`
        },
        {
          title: '9. Minors',
          content: `CUDECA services are intended for persons over 18 years of age. We do not intentionally collect data from minors. If you become aware that a minor has provided personal data, please contact us so we can proceed with its deletion.`
        },
        {
          title: '10. Privacy Policy Modifications',
          content: `CUDECA reserves the right to modify this Privacy Policy to adapt it to legislative, jurisprudential, or interpretative changes by the Spanish Data Protection Agency.

Any modification will be published on this page with sufficient advance notice before implementation.`
        },
        {
          title: '11. Contact',
          content: `For any questions, suggestions, or inquiries about our Privacy Policy, you can contact us at:

CUDECA Foundation
Calle Dehesa del Camarate 1
29004 Málaga
Email: info@cudeca.org
Phone: +34 952 56 49 10`
        }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[#00A859] hover:text-[#008A47] transition-colors mb-4">
            <ArrowLeft className="w-5 h-5" />
            {t.backToHome}
          </Link>
          <h1 className="text-gray-900 mt-2">{t.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
          {t.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-gray-900 mb-4">{section.title}</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-sm">
          <Link href="/" className="text-gray-600 hover:text-[#00A859] transition-colors">
            {t.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

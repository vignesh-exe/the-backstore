"use client";

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type DeliveryAddress = {
  country?: string;
  landmark?: string;
  addressLine1?: string;
  addressLine2?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
};

type VariantDetails = Record<string, unknown>;

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_details: VariantDetails | null;
  product_image_url: string | null;
  sku: string | null;
  quantity: number;
  unit_price: number;
  mrp: number;
  total_price: number;
  created_at: string;
};

export type InvoiceOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  status: string;
  tracking_id: string | null;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  delivery_address: DeliveryAddress;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
};

const RED = "#DA0D12";
const DARK = "#202733";
const TEXT = "#252525";
const MUTED = "#6B6B6B";
const BORDER = "#E1E1E1";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    color: TEXT,
    fontFamily: "Helvetica",
    fontSize: 9,
    paddingBottom: 90,
  },

  topRedBar: {
    height: 7,
    backgroundColor: RED,
  },

  header: {
    height: 108,
    backgroundColor: DARK,
    paddingLeft: 0,
    paddingRight: 38,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoArea: {
    width: 320,
    height: 130,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  logo: {
    width: 290,
    height: 118,
    objectFit: "contain",
    marginLeft: -30,
  },

  headerRight: {
    width: 245,
    alignItems: "flex-end",
  },

  invoiceTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 1.2,
  },

  invoiceMeta: {
    marginTop: 7,
    color: "#D5D8DC",
    fontSize: 8.5,
    lineHeight: 1.5,
    textAlign: "right",
  },

  redCurve: {
    height: 10,
    backgroundColor: RED,
  },

  content: {
    paddingHorizontal: 38,
    paddingTop: 26,
  },

  topInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  customerBlock: {
    width: "54%",
  },

  paymentBlock: {
    width: "39%",
    paddingLeft: 18,
    borderLeftWidth: 1,
    borderLeftColor: BORDER,
  },

  sectionLabel: {
    color: RED,
    fontSize: 8,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 8,
  },

  customerName: {
    color: TEXT,
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 7,
  },

  infoText: {
    color: "#4F4F4F",
    fontSize: 8.5,
    lineHeight: 1.55,
  },

  addressTitle: {
    marginTop: 9,
    color: "#888888",
    fontSize: 7,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  paymentRow: {
    flexDirection: "row",
    marginBottom: 6,
  },

  paymentLabel: {
    width: 78,
    color: "#777777",
    fontSize: 8,
  },

  paymentValue: {
    flex: 1,
    color: TEXT,
    fontSize: 8.5,
    fontWeight: 700,
  },

  tableSection: {
    marginTop: 26,
  },

  table: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 7,
    overflow: "hidden",
  },

  tableHeader: {
    minHeight: 31,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: RED,
  },

  tableHeaderText: {
    color: "#FFFFFF",
    fontSize: 7.5,
    fontWeight: 700,
    textTransform: "uppercase",
  },

  tableRow: {
    minHeight: 34,
    paddingHorizontal: 9,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  tableRowLast: {
    borderBottomWidth: 0,
  },

  noColumn: {
    width: 32,
  },

  productColumn: {
    flex: 1,
    paddingRight: 8,
  },

  priceColumn: {
    width: 72,
    textAlign: "right",
  },

  quantityColumn: {
    width: 45,
    textAlign: "center",
  },

  totalColumn: {
    width: 78,
    textAlign: "right",
  },

  productName: {
    color: TEXT,
    fontSize: 8.5,
    fontWeight: 700,
    lineHeight: 1.25,
  },

  productMeta: {
    marginTop: 3,
    color: "#888888",
    fontSize: 6.8,
  },

  cellText: {
    color: "#444444",
    fontSize: 8,
  },

  summaryArea: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  thankYou: {
    width: "55%",
    paddingTop: 3,
  },

  thankYouTitle: {
    color: TEXT,
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 14,
  },

  termsTitle: {
    color: RED,
    fontSize: 8,
    fontWeight: 700,
    marginBottom: 5,
  },

  termsText: {
    color: "#777777",
    fontSize: 7.2,
    lineHeight: 1.45,
  },

  summary: {
    width: 220,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 7,
    overflow: "hidden",
  },

  summaryRow: {
    minHeight: 27,
    paddingHorizontal: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  summaryLabel: {
    color: "#666666",
    fontSize: 8,
  },

  summaryValue: {
    color: TEXT,
    fontSize: 8.5,
    fontWeight: 700,
  },

  discountValue: {
    color: "#18864B",
    fontSize: 8.5,
    fontWeight: 700,
  },

  totalRow: {
    minHeight: 38,
    paddingHorizontal: 11,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: RED,
  },

  totalLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: 700,
  },

  totalValue: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: 700,
  },

  footer: {
    position: "absolute",
    left: 38,
    right: 38,
    bottom: 22,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  footerLeft: {
    width: "65%",
  },

  footerTitle: {
    color: TEXT,
    fontSize: 8.5,
    fontWeight: 700,
  },

  footerText: {
    marginTop: 3,
    color: "#888888",
    fontSize: 7,
  },

  footerRight: {
    width: "30%",
    alignItems: "flex-end",
  },

  footerStatus: {
    color: RED,
    fontSize: 7.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

function formatPrice(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  return `Rs. ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0)}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getAddressLines(address: DeliveryAddress | null | undefined) {
  if (!address) {
    return [];
  }

  return [
    address.addressLine1,
    address.addressLine2,
    address.landmark,
    address.city,
    address.district,
    address.state,
    address.pincode,
    address.country,
  ].filter(Boolean) as string[];
}

function getVariantText(variantDetails: VariantDetails | null) {
  if (!variantDetails) {
    return "";
  }

  return Object.entries(variantDetails)
    .filter(
      ([, value]) =>
        value !== null && value !== undefined && String(value).trim() !== "",
    )
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(" • ");
}

export default function Invoice({ order }: { order: InvoiceOrder }) {
  const addressLines = getAddressLines(order.delivery_address);

  return (
    <Document
      title={`Invoice - ${order.order_number}`}
      author="The Backstore"
      subject={`Invoice for order ${order.order_number}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.topRedBar} />

        <View style={styles.header}>
          <View style={styles.logoArea}>
            <Image src="/logo/backstore-logo.png" style={styles.logo} />
          </View>

          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>

            <Text style={styles.invoiceMeta}>
              Invoice No: {order.order_number}
              {"\n"}
              Invoice Date: {formatDate(order.created_at)}
            </Text>
          </View>
        </View>

        <View style={styles.redCurve} />

        <View style={styles.content}>
          <View style={styles.topInfo}>
            <View style={styles.customerBlock}>
              <Text style={styles.sectionLabel}>Invoice To</Text>

              <Text style={styles.customerName}>{order.customer_name}</Text>

              {order.customer_phone && (
                <Text style={styles.infoText}>
                  Phone: {order.customer_phone}
                </Text>
              )}

              {order.customer_email && (
                <Text style={styles.infoText}>
                  Email: {order.customer_email}
                </Text>
              )}

              <Text style={styles.addressTitle}>Delivery Address</Text>

              {addressLines.length > 0 ? (
                addressLines.map((line, index) => (
                  <Text key={`${line}-${index}`} style={styles.infoText}>
                    {line}
                  </Text>
                ))
              ) : (
                <Text style={styles.infoText}>
                  Delivery address unavailable.
                </Text>
              )}
            </View>

            <View style={styles.paymentBlock}>
              <Text style={styles.sectionLabel}>Payment Details</Text>

              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Payment Method</Text>

                <Text style={styles.paymentValue}>{order.payment_method}</Text>
              </View>

              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Payment Status</Text>

                <Text style={styles.paymentValue}>{order.payment_status}</Text>
              </View>

              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Order Status</Text>

                <Text style={styles.paymentValue}>{order.status}</Text>
              </View>

              {order.tracking_id && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Tracking ID</Text>

                  <Text style={styles.paymentValue}>{order.tracking_id}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.tableSection}>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <View style={styles.noColumn}>
                  <Text style={styles.tableHeaderText}>No.</Text>
                </View>

                <View style={styles.productColumn}>
                  <Text style={styles.tableHeaderText}>Item Description</Text>
                </View>

                <View style={styles.priceColumn}>
                  <Text style={styles.tableHeaderText}>Price</Text>
                </View>

                <View style={styles.quantityColumn}>
                  <Text style={styles.tableHeaderText}>Qty</Text>
                </View>

                <View style={styles.totalColumn}>
                  <Text style={styles.tableHeaderText}>Total</Text>
                </View>
              </View>

              {order.order_items.map((item, index) => {
                const variantText = getVariantText(item.variant_details);

                const isLast = index === order.order_items.length - 1;

                return (
                  <View
                    key={item.id}
                    style={[styles.tableRow, isLast ? styles.tableRowLast : {}]}
                  >
                    <View style={styles.noColumn}>
                      <Text style={styles.cellText}>
                        {String(index + 1).padStart(2, "0")}
                      </Text>
                    </View>

                    <View style={styles.productColumn}>
                      <Text style={styles.productName}>
                        {item.product_name}
                      </Text>

                      {variantText && (
                        <Text style={styles.productMeta}>{variantText}</Text>
                      )}

                      {item.sku && (
                        <Text style={styles.productMeta}>SKU: {item.sku}</Text>
                      )}
                    </View>

                    <View style={styles.priceColumn}>
                      <Text style={styles.cellText}>
                        {formatPrice(item.unit_price)}
                      </Text>
                    </View>

                    <View style={styles.quantityColumn}>
                      <Text style={styles.cellText}>{item.quantity}</Text>
                    </View>

                    <View style={styles.totalColumn}>
                      <Text style={styles.cellText}>
                        {formatPrice(item.total_price)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.summaryArea}>
            <View style={styles.thankYou}>
              <Text style={styles.thankYouTitle}>
                Thank you for shopping with us.
              </Text>

              <Text style={styles.termsTitle}>Terms &amp; Conditions</Text>

              <Text style={styles.termsText}>
                This invoice is generated electronically for your order from The
                Backstore. Please retain this invoice for your records. Product
                returns, exchanges and cancellations are subject to the
                applicable Backstore policies.
              </Text>
            </View>

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>

                <Text style={styles.summaryValue}>
                  {formatPrice(order.subtotal)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>

                <Text style={styles.summaryValue}>
                  {formatPrice(order.shipping_amount)}
                </Text>
              </View>

              {Number(order.discount_amount) > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount</Text>

                  <Text style={styles.discountValue}>
                    -{formatPrice(order.discount_amount)}
                  </Text>
                </View>
              )}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>

                <Text style={styles.totalValue}>
                  {formatPrice(order.total_amount)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerTitle}>THE BACKSTORE</Text>

            <Text style={styles.footerText}>
              Thank you for choosing The Backstore.
            </Text>
          </View>

          <View style={styles.footerRight}>
            <Text style={styles.footerStatus}>{order.payment_status}</Text>

            <Text style={styles.footerText}>Computer-generated invoice</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

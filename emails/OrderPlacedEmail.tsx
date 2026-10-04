import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "react-email";

type OrderItem = {
  name: string;
  size?: string;
  quantity: number;
  price: number;
  image?: string | null;
  isCustom?: boolean;
  customColor?: string | null;
};

type OrderPlacedEmailProps = {
  fullName: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingAmount: number;
  discount: number;
  couponCode?: string | null;
  totalAmount: number;
  paymentMethod: string;
};

function formatPrice(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export default function OrderPlacedEmail({
  fullName,
  orderNumber,
  items,
  subtotal,
  shippingAmount,
  discount,
  couponCode,
  totalAmount,
  paymentMethod,
}: OrderPlacedEmailProps) {
  const firstName = fullName.trim().split(/\s+/)[0] || "there";

  return (
    <Html lang="en">
      <Head />

      <Preview>
        Order {orderNumber} is confirmed — we&apos;ve got your Backstore order.
      </Preview>

      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#080808",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <Container
          style={{
            width: "100%",
            maxWidth: "620px",
            margin: "0 auto",
            backgroundColor: "#111111",
          }}
        >
          {/* Top strip */}
          <Section
            style={{
              height: "6px",
              backgroundColor: "#DA0D12",
            }}
          />

          {/* Header */}
          <Section
            style={{
              padding: "30px 36px 26px",
              borderBottom: "1px solid #252525",
            }}
          >
            <Img
              src="https://thebackstore.in/logo/backstore-logo.png"
              alt="The Backstore"
              width="150"
              style={{
                display: "block",
                margin: "0 auto",
              }}
            />

            <Text
              style={{
                margin: "16px 0 0",
                textAlign: "center",
                color: "#666362",
                fontSize: "9px",
                fontWeight: "700",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              ORDER CONFIRMATION
            </Text>
          </Section>

          {/* Confirmation hero */}
          <Section
            style={{
              padding: "48px 36px 38px",
              textAlign: "center",
              backgroundColor: "#0D0D0D",
            }}
          >
            <Text
              style={{
                margin: "0 0 12px",
                color: "#DA0D12",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "4px",
                textTransform: "uppercase",
              }}
            >
              ORDER PLACED
            </Text>

            <Heading
              style={{
                margin: 0,
                color: "#CBCAC8",
                fontSize: "44px",
                lineHeight: "0.95",
                fontWeight: "900",
                letterSpacing: "-1px",
              }}
            >
              WE&apos;VE GOT
              <br />
              <span style={{ color: "#DA0D12" }}>YOUR ORDER.</span>
            </Heading>

            <Text
              style={{
                maxWidth: "440px",
                margin: "24px auto 0",
                color: "#8A8886",
                fontSize: "14px",
                lineHeight: "1.8",
              }}
            >
              Hey {firstName},
              <br />
              your payment was successful and your order has been placed.
            </Text>
          </Section>

          {/* Order number */}
          <Section
            style={{
              padding: "0 36px",
            }}
          >
            <Section
              style={{
                padding: "24px",
                backgroundColor: "#181818",
                borderLeft: "3px solid #DA0D12",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  color: "#666362",
                  fontSize: "9px",
                  fontWeight: "700",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                ORDER NUMBER
              </Text>

              <Text
                style={{
                  margin: "10px 0 0",
                  color: "#CBCAC8",
                  fontSize: "20px",
                  lineHeight: "1.3",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  textAlign: "center",
                }}
              >
                {orderNumber}
              </Text>

              <Text
                style={{
                  margin: "8px 0 0",
                  color: "#DA0D12",
                  fontSize: "9px",
                  fontWeight: "700",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  textAlign: "center",
                }}
              >
                PAYMENT RECEIVED
              </Text>
            </Section>
          </Section>

          {/* Order items */}
          <Section
            style={{
              padding: "38px 36px 10px",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#CBCAC8",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              YOUR ORDER
            </Text>

            {items.map((item, index) => (
              <Section
                key={`${item.name}-${item.size}-${index}`}
                style={{
                  padding: "20px 0",
                  borderBottom:
                    index === items.length - 1 ? "none" : "1px solid #252525",
                }}
              >
                <table
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  role="presentation"
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          width: "72px",
                          verticalAlign: "top",
                        }}
                      >
                        {item.image ? (
                          <Img
                            src={item.image}
                            alt={item.name}
                            width="64"
                            height="64"
                            style={{
                              display: "block",
                              width: "64px",
                              height: "64px",
                              objectFit: "cover",
                              backgroundColor: "#181818",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "64px",
                              height: "64px",
                              backgroundColor: "#181818",
                            }}
                          />
                        )}
                      </td>

                      <td
                        style={{
                          verticalAlign: "top",
                          paddingLeft: "14px",
                          paddingRight: "10px",
                        }}
                      >
                        <Text
                          style={{
                            margin: 0,
                            color: "#CBCAC8",
                            fontSize: "13px",
                            lineHeight: "1.4",
                            fontWeight: "700",
                          }}
                        >
                          {item.name}
                        </Text>

                        <Text
                          style={{
                            margin: "7px 0 0",
                            color: "#666362",
                            fontSize: "10px",
                            lineHeight: "1.6",
                          }}
                        >
                          {item.size ? `Size: ${item.size}` : ""}
                          {item.size && item.customColor ? "  •  " : ""}
                          {item.customColor ? `Color: ${item.customColor}` : ""}
                          {item.isCustom ? "  •  Custom" : ""}
                          {(item.size || item.customColor || item.isCustom) &&
                          item.quantity
                            ? "  •  "
                            : ""}
                          Qty: {item.quantity}
                        </Text>
                      </td>

                      <td
                        style={{
                          width: "90px",
                          verticalAlign: "top",
                          textAlign: "right",
                        }}
                      >
                        <Text
                          style={{
                            margin: 0,
                            color: "#CBCAC8",
                            fontSize: "12px",
                            fontWeight: "700",
                          }}
                        >
                          {formatPrice(item.price * item.quantity)}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>
            ))}
          </Section>

          {/* Price summary */}
          <Section
            style={{
              padding: "10px 36px 0",
            }}
          >
            <Section
              style={{
                padding: "24px",
                backgroundColor: "#181818",
              }}
            >
              <table
                width="100%"
                cellPadding="0"
                cellSpacing="0"
                role="presentation"
              >
                <tbody>
                  <tr>
                    <td>
                      <Text
                        style={{
                          margin: 0,
                          color: "#666362",
                          fontSize: "11px",
                        }}
                      >
                        Subtotal
                      </Text>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <Text
                        style={{
                          margin: 0,
                          color: "#CBCAC8",
                          fontSize: "11px",
                        }}
                      >
                        {formatPrice(subtotal)}
                      </Text>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ paddingTop: "10px" }}>
                      <Text
                        style={{
                          margin: 0,
                          color: "#666362",
                          fontSize: "11px",
                        }}
                      >
                        Shipping
                      </Text>
                    </td>

                    <td
                      style={{
                        paddingTop: "10px",
                        textAlign: "right",
                      }}
                    >
                      <Text
                        style={{
                          margin: 0,
                          color: shippingAmount === 0 ? "#DA0D12" : "#CBCAC8",
                          fontSize: "11px",
                        }}
                      >
                        {shippingAmount === 0
                          ? "FREE"
                          : formatPrice(shippingAmount)}
                      </Text>
                    </td>
                  </tr>

                  {discount > 0 && (
                    <tr>
                      <td style={{ paddingTop: "10px" }}>
                        <Text
                          style={{
                            margin: 0,
                            color: "#666362",
                            fontSize: "11px",
                          }}
                        >
                          Discount
                          {couponCode ? ` (${couponCode})` : ""}
                        </Text>
                      </td>

                      <td
                        style={{
                          paddingTop: "10px",
                          textAlign: "right",
                        }}
                      >
                        <Text
                          style={{
                            margin: 0,
                            color: "#DA0D12",
                            fontSize: "11px",
                          }}
                        >
                          -{formatPrice(discount)}
                        </Text>
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td
                      colSpan={2}
                      style={{
                        paddingTop: "18px",
                        borderTop: "1px solid #303030",
                      }}
                    >
                      <table
                        width="100%"
                        cellPadding="0"
                        cellSpacing="0"
                        role="presentation"
                      >
                        <tbody>
                          <tr>
                            <td>
                              <Text
                                style={{
                                  margin: 0,
                                  color: "#CBCAC8",
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  letterSpacing: "1px",
                                  textTransform: "uppercase",
                                }}
                              >
                                Total
                              </Text>
                            </td>

                            <td style={{ textAlign: "right" }}>
                              <Text
                                style={{
                                  margin: 0,
                                  color: "#DA0D12",
                                  fontSize: "22px",
                                  fontWeight: "900",
                                }}
                              >
                                {formatPrice(totalAmount)}
                              </Text>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
          </Section>

          {/* Payment */}
          <Section
            style={{
              padding: "30px 36px 10px",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#666362",
                fontSize: "9px",
                fontWeight: "700",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              PAYMENT
            </Text>

            <Text
              style={{
                margin: "10px 0 0",
                color: "#CBCAC8",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              {paymentMethod} <span style={{ color: "#666362" }}>•</span>{" "}
              <span style={{ color: "#DA0D12" }}>PAID</span>
            </Text>
          </Section>

          {/* Order journey */}
          <Section
            style={{
              padding: "34px 36px 42px",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#CBCAC8",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "3px",
                textTransform: "uppercase",
                textAlign: "center",
              }}
            >
              WHAT HAPPENS NEXT
            </Text>

            <Text
              style={{
                margin: "24px 0 0",
                color: "#8A8886",
                fontSize: "10px",
                lineHeight: "2.2",
                textAlign: "center",
                letterSpacing: "1px",
              }}
            >
              <span style={{ color: "#DA0D12", fontWeight: "700" }}>
                PLACED
              </span>
              {"  →  "}
              CONFIRMED
              {"  →  "}
              PACKED
              {"  →  "}
              SHIPPED
              {"  →  "}
              DELIVERED
            </Text>

            <Text
              style={{
                maxWidth: "420px",
                margin: "18px auto 0",
                color: "#666362",
                fontSize: "11px",
                lineHeight: "1.7",
                textAlign: "center",
              }}
            >
              We&apos;ll keep you updated as your order moves through each
              stage.
            </Text>
          </Section>

          {/* CTA */}
          <Section
            style={{
              padding: "0 36px 46px",
              textAlign: "center",
            }}
          >
            <Button
              href="https://thebackstore.in/my-orders"
              style={{
                display: "inline-block",
                padding: "15px 28px",
                backgroundColor: "#DA0D12",
                color: "#FFFFFF",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "2px",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              VIEW MY ORDER →
            </Button>
          </Section>

          {/* Footer */}
          <Section
            style={{
              padding: "26px 36px 30px",
              borderTop: "1px solid #252525",
              textAlign: "center",
              backgroundColor: "#0B0B0B",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#444240",
                fontSize: "9px",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              ORDER CONFIRMATION
            </Text>

            <Text
              style={{
                margin: "10px 0 0",
                color: "#DA0D12",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "3px",
              }}
            >
              THE BACKSTORE
            </Text>

            <Text
              style={{
                margin: "14px 0 0",
                color: "#333333",
                fontSize: "8px",
              }}
            >
              © The Backstore. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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

type OrderDeliveredItem = {
  name: string;
  size?: string;
  quantity: number;
  price: number;
  image?: string | null;
  isCustom?: boolean;
  customColor?: string | null;
};

type OrderDeliveredEmailProps = {
  fullName: string;
  orderNumber: string;
  items: OrderDeliveredItem[];
  totalAmount: number;
  paymentMethod: string;
};

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function OrderDeliveredEmail({
  fullName,
  orderNumber,
  items,
  totalAmount,
  paymentMethod,
}: OrderDeliveredEmailProps) {
  const firstName = fullName.trim().split(/\s+/)[0] || "there";

  const previewText = `Your Backstore order ${orderNumber} has been delivered.`;

  return (
    <Html lang="en">
      <Head />

      <Preview>{previewText}</Preview>

      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#080808",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#CBCAC8",
        }}
      >
        <Container
          style={{
            width: "100%",
            maxWidth: "620px",
            margin: "0 auto",
            backgroundColor: "#080808",
          }}
        >
          {/* HEADER */}

          <Section
            style={{
              padding: "30px 36px 20px",
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
                margin: "8px 0 0",
                fontSize: "8px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#666362",
              }}
            >
              DELIVERY COMPLETE
            </Text>
          </Section>

          {/* HERO */}

          <Section
            style={{
              padding: "46px 36px 42px",
              textAlign: "center",
              backgroundColor: "#111111",
            }}
          >
            <Text
              style={{
                margin: "0 auto 18px",
                width: "64px",
                height: "64px",
                lineHeight: "64px",
                borderRadius: "50%",
                backgroundColor: "#DA0D12",
                color: "#ffffff",
                fontSize: "30px",
                fontWeight: 900,
              }}
            >
              ✓
            </Text>

            <Heading
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "30px",
                lineHeight: "1.1",
                fontWeight: 900,
                letterSpacing: "-0.04em",
              }}
            >
              ORDER DELIVERED.
            </Heading>

            <Text
              style={{
                margin: "14px 0 0",
                color: "#CBCAC8",
                fontSize: "14px",
                lineHeight: "1.7",
              }}
            >
              Hey {firstName}, your Backstore package has officially reached
              you.
            </Text>

            <Text
              style={{
                margin: "20px 0 0",
                display: "inline-block",
                padding: "8px 14px",
                border: "1px solid #252525",
                backgroundColor: "#181818",
                color: "#DA0D12",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.12em",
              }}
            >
              ORDER #{orderNumber}
            </Text>
          </Section>

          {/* DELIVERY MESSAGE */}

          <Section
            style={{
              padding: "10px 36px 0",
            }}
          >
            <Section
              style={{
                padding: "22px",
                backgroundColor: "#181818",
                borderLeft: "3px solid #DA0D12",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  fontSize: "9px",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  color: "#8A8886",
                }}
              >
                DELIVERY STATUS
              </Text>

              <Text
                style={{
                  margin: "10px 0 0",
                  fontSize: "17px",
                  fontWeight: 800,
                  color: "#ffffff",
                }}
              >
                Your order is now with you.
              </Text>

              <Text
                style={{
                  margin: "8px 0 0",
                  fontSize: "12px",
                  lineHeight: "1.7",
                  color: "#8A8886",
                }}
              >
                We hope you love everything you ordered. Thanks for choosing The
                Backstore.
              </Text>
            </Section>
          </Section>

          {/* ORDER ITEMS */}

          <Section
            style={{
              padding: "28px 36px 0",
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.16em",
                color: "#8A8886",
              }}
            >
              YOUR ORDER
            </Text>

            <Text
              style={{
                margin: "5px 0 16px",
                fontSize: "18px",
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              What arrived
            </Text>

            {items.map((item, index) => (
              <Section
                key={`${item.name}-${index}`}
                style={{
                  marginBottom: "10px",
                  padding: "14px",
                  backgroundColor: "#111111",
                  border: "1px solid #252525",
                }}
              >
                <Text
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#ffffff",
                  }}
                >
                  {item.name}
                </Text>

                <Text
                  style={{
                    margin: "5px 0 0",
                    fontSize: "10px",
                    color: "#8A8886",
                  }}
                >
                  {item.size ? `Size: ${item.size}  •  ` : ""}
                  Qty: {item.quantity}
                  {item.isCustom ? "  •  Custom" : ""}
                </Text>

                {item.customColor && (
                  <Text
                    style={{
                      margin: "5px 0 0",
                      fontSize: "9px",
                      color: "#666362",
                    }}
                  >
                    Color: {item.customColor}
                  </Text>
                )}

                <Text
                  style={{
                    margin: "9px 0 0",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: "#DA0D12",
                  }}
                >
                  {formatCurrency(item.price * item.quantity)}
                </Text>
              </Section>
            ))}
          </Section>

          {/* SUMMARY */}

          <Section
            style={{
              padding: "26px 36px 0",
            }}
          >
            <Section
              style={{
                padding: "22px",
                backgroundColor: "#181818",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  fontSize: "9px",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  color: "#8A8886",
                }}
              >
                ORDER SUMMARY
              </Text>

              <Text
                style={{
                  margin: "14px 0 0",
                  fontSize: "11px",
                  color: "#8A8886",
                }}
              >
                Payment method
              </Text>

              <Text
                style={{
                  margin: "4px 0 0",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {paymentMethod}
              </Text>

              <Text
                style={{
                  margin: "18px 0 0",
                  fontSize: "11px",
                  color: "#8A8886",
                }}
              >
                Total paid
              </Text>

              <Text
                style={{
                  margin: "4px 0 0",
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "#DA0D12",
                }}
              >
                {formatCurrency(totalAmount)}
              </Text>
            </Section>
          </Section>

          {/* CTA */}

          <Section
            style={{
              padding: "30px 36px",
              textAlign: "center",
            }}
          >
            <Button
              href="https://thebackstore.in/orders"
              style={{
                display: "inline-block",
                padding: "14px 24px",
                backgroundColor: "#DA0D12",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textDecoration: "none",
              }}
            >
              VIEW MY ORDERS →
            </Button>
          </Section>

          {/* THANK YOU */}

          <Section
            style={{
              padding: "0 36px 36px",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              THANKS FOR SHOPPING THE BACKSTORE.
            </Text>

            <Text
              style={{
                margin: "8px 0 0",
                fontSize: "11px",
                lineHeight: "1.7",
                color: "#666362",
              }}
            >
              Your order journey is complete.
              <br />
              Until the next drop.
            </Text>
          </Section>

          {/* FOOTER */}

          <Section
            style={{
              padding: "22px 36px 30px",
              borderTop: "1px solid #252525",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: "8px",
                fontWeight: 800,
                letterSpacing: "0.18em",
                color: "#DA0D12",
              }}
            >
              THE BACKSTORE
            </Text>

            <Text
              style={{
                margin: "8px 0 0",
                fontSize: "9px",
                color: "#666362",
              }}
            >
              MADE WITH ATTITUDE. WORN WITH PRIDE.
            </Text>

            <Text
              style={{
                margin: "12px 0 0",
                fontSize: "8px",
                color: "#444240",
              }}
            >
              © {new Date().getFullYear()} The Backstore. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

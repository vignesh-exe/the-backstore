import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "react-email";

type CancellationRequestEmailProps = {
  fullName: string;
  orderNumber: string;
  reason: string;
};

export default function CancellationRequestEmail({
  fullName,
  orderNumber,
  reason,
}: CancellationRequestEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Your order {orderNumber} has been cancelled</Preview>

      <Body
        style={{
          margin: 0,
          padding: "24px 0",
          backgroundColor: "#080808",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            backgroundColor: "#101010",
            border: "1px solid #242424",
          }}
        >
          {/* LOGO */}

          <Section
            style={{
              padding: "30px 30px 20px",
              textAlign: "center",
            }}
          >
            <Img
              src="https://thebackstore.in/logo/backstore-logo.png"
              alt="The Backstore"
              width="150"
              style={{
                margin: "0 auto",
                display: "block",
              }}
            />
          </Section>

          {/* CONTENT */}

          <Section
            style={{
              padding: "20px 30px 35px",
            }}
          >
            <Text
              style={{
                margin: "0 0 8px",
                color: "#DA0D12",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Order Cancelled
            </Text>

            <Heading
              style={{
                margin: "0 0 18px",
                color: "#F2F2F0",
                fontSize: "32px",
                lineHeight: "1.1",
                fontWeight: "700",
              }}
            >
              Your Order Has Been Cancelled
            </Heading>

            <Text
              style={{
                margin: "0 0 18px",
                color: "#AAAAAA",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Hi {fullName},
            </Text>

            <Text
              style={{
                margin: "0 0 20px",
                color: "#AAAAAA",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Your order{" "}
              <strong style={{ color: "#F2F2F0" }}>{orderNumber}</strong> has
              been cancelled successfully.
            </Text>

            {/* ORDER */}

            <Section
              style={{
                margin: "20px 0",
                padding: "16px",
                backgroundColor: "#151515",
                border: "1px solid #242424",
              }}
            >
              <Text
                style={{
                  margin: "0 0 8px",
                  color: "#666666",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Order Number
              </Text>

              <Text
                style={{
                  margin: 0,
                  color: "#F2F2F0",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                {orderNumber}
              </Text>
            </Section>

            {/* REASON */}

            <Section
              style={{
                margin: "20px 0",
                padding: "16px",
                backgroundColor: "#151515",
                border: "1px solid #242424",
              }}
            >
              <Text
                style={{
                  margin: "0 0 8px",
                  color: "#666666",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Cancellation Reason
              </Text>

              <Text
                style={{
                  margin: 0,
                  color: "#CBCAC8",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {reason}
              </Text>
            </Section>

            {/* STATUS */}

            <Section
              style={{
                margin: "24px 0",
                padding: "14px 16px",
                backgroundColor: "#DA0D12",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Status: Order Cancelled
              </Text>
            </Section>

            <Text
              style={{
                margin: "0",
                color: "#777777",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              Your cancellation request has been reviewed and your order has now
              been cancelled by the Backstore team.
            </Text>

            <Text
              style={{
                margin: "24px 0 0",
                color: "#555555",
                fontSize: "12px",
                lineHeight: "1.5",
              }}
            >
              Thank you for shopping with The Backstore.
            </Text>
          </Section>

          {/* FOOTER */}

          <Section
            style={{
              padding: "18px 30px",
              borderTop: "1px solid #242424",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                margin: 0,
                color: "#444444",
                fontSize: "11px",
              }}
            >
              The Backstore · Made in India
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

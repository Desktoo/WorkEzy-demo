// components/poster/PosterPdfDocument.tsx

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
  Font
} from "@react-pdf/renderer";

type PosterPdfProps = {
  jobId: string,
  jobTitle: string;
  city: string;
  state: string;
  salaryFrom: string;
  salaryTo: string;
  workingDays: string;
  requirements: string;
};

Font.register({
  family: "Inter",
  src: "/fonts/Inter-Regular.ttf",
});


export function PosterPdfDocument({
  jobId,
  jobTitle,
  city,
  state,
  salaryFrom,
  salaryTo,
  workingDays,
  requirements,
}: PosterPdfProps) {

  const applyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/apply/${jobId}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Decorative circles */}
        <View style={styles.circleTop} />
        <View style={styles.circleBottom} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.hiringText}>We are Hiring!</Text>
            <Text style={styles.jobTitle}>{jobTitle}</Text>
          </View>

          {/* Logo */}
          <Image
            src="/assets/workezy-logo.png"
            style={styles.logo}
          />
        </View>

        {/* Job Details */}
        <View style={styles.list}>
          <DetailRow text={`Location: ${city}, ${state}`} />
          <DetailRow text={`Working Days: ${workingDays} days/week`} />
          <DetailRow text={`Salary: ₹${salaryFrom} – ₹${salaryTo}/month`} />
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <Text style={styles.description}>
            {requirements}
          </Text>
        </View>

        {/* Apply Button */}
        <View style={styles.applyWrapper}>
          <Link src={applyUrl} style={styles.applyButton}>
            <Text style={styles.applyText}>APPLY NOW</Text>
          </Link>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.powered}>
            Powered by <Text style={styles.brand}>work<Text style={styles.brandRed}>ezy</Text></Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
}

/* ---------- Helper Row (Image-based arrow) ---------- */

function DetailRow({ text }: { text: string }) {
  return (
    <View style={styles.row}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image
        src="/assets/chevron-right.png"
        style={styles.chevron}
      />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Inter",
    position: "relative",
    backgroundColor: "#ffffff",
  },

  circleTop: {
    position: "absolute",
    top: -80,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#BE414510",
  },

  circleBottom: {
    position: "absolute",
    bottom: -120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#BE414510",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },

  hiringText: {
    fontSize: 26,
    fontWeight: "bold",
  },

  jobTitle: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#BE4145",
    marginTop: 5,
  },

  logo: {
    width: 80,
    height: 60,
    objectFit: "contain",
  },

  list: {
    marginVertical: 20,
    gap: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    
  },

  chevron: {
    width: 10,
    height: 10,
  },

  rowText: {
    fontSize: 18,
    fontWeight: "medium",
  },

  section: {
    marginTop: 30,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  description: {
    color: "#555",
    lineHeight: 1.5,
  },

  applyWrapper: {
    marginTop: 40,
  },

  applyButton: {
    width: 164,
    backgroundColor: "#BE4145",
    paddingVertical: 16,
    paddingHorizontal: 34,
    borderRadius: 20,
    textDecoration: "none",
    bottom: -60
  },

  applyText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  footer: {
    position: "absolute",
    bottom: 40,
    right: 40,
  },

  powered: {
    fontSize: 10,
    color: "#888",
  },

  brand: {
    fontWeight: "bold",
    color: "#000",
  },

  brandRed: {
    fontWeight: "bold",
    color: "#BE4145"
  }
});

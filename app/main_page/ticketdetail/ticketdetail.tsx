/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { IoArrowBack, IoEllipsisVertical, IoHeart } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

// react-pdf imports
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Image as PDFImage,
  StyleSheet,
} from "@react-pdf/renderer";

interface BookingResponse {
  booking_date: string;
  event: {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    preview_image: string;
    category: { id: string; name: string; description: string };
    event_schedules: {
      id: string;
      start_time: string;
      end_time: string;
      start_checkin_time: string;
      end_checkin_time: string;
    }[];
  };
  id: string;
  price: number;
  tickets: {
    id: string;
    price: number;
    qr: string;
    seat: { id: string; seat_number: string; status: string };
  }[];
}

// PDF styles
const pdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "#F41F52",
    color: "white",
    fontFamily: "Helvetica",
    padding: 20,
    width: 375,
    height: 600,
  },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  section: { marginBottom: 20 },
  ticketName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  ticketPrice: { fontSize: 17, color: "#FEFEFE", marginBottom: 5 },
  label: { fontSize: 12, color: "#FEFEFE" },
  value: { fontSize: 14, fontWeight: "bold", color: "white" },
  qrContainer: { marginTop: 10, alignItems: "center" },
  qrImage: { width: 150, height: 150 },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E3E7EC",
    marginVertical: 10,
  },
});

const TicketPDF = ({
  booking,
  ticket,
}: {
  booking: BookingResponse;
  ticket: any;
}) => {
  const event = booking.event;
  const schedule = event.event_schedules[0];
  const eventDate = new Date(booking.booking_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Document>
      <Page size={{ width: 375, height: 600 }} style={pdfStyles.page}>
        <Text style={pdfStyles.header}>Ticket Detail</Text>
        <View style={pdfStyles.section}>
          <Text style={pdfStyles.ticketName}>{event.name}</Text>
          <Text style={pdfStyles.ticketPrice}>${ticket.price.toFixed(2)}</Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={pdfStyles.label}>Ticket Holder</Text>
              <Text style={pdfStyles.value}>
                {localStorage.getItem("user_name") || "User"}
              </Text>
            </View>
            <View>
              <Text style={pdfStyles.label}>Date</Text>
              <Text style={pdfStyles.value}>
                {eventDate} at {schedule?.start_time || "TBA"}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <View>
              <Text style={pdfStyles.label}>Location</Text>
              <Text style={pdfStyles.value}>
                {event.address}, {event.city}
              </Text>
            </View>
            <View>
              <Text style={pdfStyles.label}>Seat</Text>
              <Text style={pdfStyles.value}>
                {ticket.seat?.seat_number || "N/A"}
              </Text>
            </View>
          </View>

          <View style={pdfStyles.divider} />

          <View style={pdfStyles.qrContainer}>
            {ticket.qr ? (
              <PDFImage src={ticket.qr} style={pdfStyles.qrImage} />
            ) : (
              <Text>No QR code available</Text>
            )}
            <Text style={{ fontSize: 12, color: "FEFEFE", marginTop: 5 }}>
              Scan the QR code
            </Text>
          </View>
        </View>
        <Text
          style={{
            position: "absolute",
            bottom: 10,
            width: "100%",
            textAlign: "center",
            fontSize: 10,
            color: "white",
          }}
        >
          Tickla!!! Thank you so much for using it
        </Text>
      </Page>
    </Document>
  );
};

export default function TicketDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const ticketId = searchParams.get("ticketId");

  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<BookingResponse["tickets"][0] | null>(
    null
  );

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    apiFetch(`/bookings/${bookingId}`)
      .then((raw: any) => {
        const event = raw.event_id;

        const schedule =
          event?.event_schedules?.[0] ||
          raw.booking_items?.[0]?.event_schedule_id ||
          null;

        const tickets = (raw.booking_items || []).map(
          (item: any): BookingResponse["tickets"][number] => ({
            id: item.id,
            price: item.price,
            qr: item.qr,
            seat: {
              id: item.seat_id?.id,
              seat_number: item.seat_id?.seat_number,
              status: item.seat_id?.status,
            },
          })
        );

        const totalPrice = tickets.reduce(
          (sum: number, t: BookingResponse["tickets"][number]) =>
            sum + (t.price || 0),
          0
        );

        const bookingData: BookingResponse = {
          id: raw.id,
          booking_date: raw.created_at || new Date().toISOString(),
          price: totalPrice,
          event: {
            id: event.id,
            name: event.name,
            address: event.address,
            city: event.city,
            country: event.country,
            preview_image: event.preview_image,
            category: event.category_id,
            event_schedules: schedule ? [schedule] : [],
          },
          tickets,
        };

        setBooking(bookingData);
        const found = tickets.find(
          (t: BookingResponse["tickets"][number]) => t.id === ticketId
        );
        setTicket(found || null);
      })
      .catch((err) => {
        console.error("Error loading ticket:", err);
        setError("Failed to load ticket detail");
      })
      .finally(() => setLoading(false));
  }, [bookingId, ticketId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading ticket...
      </div>
    );
  }

  if (error || !booking || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <p>{error || "Ticket not found."}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-[#F41F52] text-white rounded-full text-sm font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const event = booking.event;
  const schedule = event.event_schedules[0];
  const eventDate = new Date(booking.booking_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="h-screen overflow-y-auto bg-[#24223B] text-white font-['PlusJakartaSans'] relative flex flex-col items-center hide-scrollbar ">
      {/* Header */}
      <div className="w-full max-w-[375px] px-4 pt-6">
        <div className="flex items-center justify-between">
          <button
            aria-label="back"
            onClick={() => router.push("/main_page/home")}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
          >
            <IoArrowBack size={20} />
          </button>

          <h1 className="text-[18px] font-semibold">Ticket Detail</h1>

          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <IoEllipsisVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Card */}
      <div className="w-full max-w-[375px] px-4 mt-6">
        <div className="mx-auto w-[335px] bg-white rounded-[16px] text-black relative overflow-hidden">
          {/* Cover image */}
          <div className="relative h-[160px] w-full bg-gray-200">
            <Image
              src={event.preview_image || "/images/event-sample.jpg"}
              alt={event.name}
              fill
              className="object-cover"
            />
            <div className="absolute left-4 top-4 bg-white rounded-full px-3 py-1">
              <span className="text-xs font-medium text-black">
                {event.category?.name || "Event"}
              </span>
            </div>
            <button className="absolute right-4 top-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <IoHeart size={16} className="text-[#E53935]" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 pt-4 pb-6">
            <div className="flex items-start justify-between">
              <h2 className="text-[14px] font-semibold text-black max-w-[220px]">
                {event.name}
              </h2>
              <div className="bg-[#FFF0F3] text-[#F41F52] rounded-full px-3 py-1 text-[12px] font-medium">
                ${ticket.price.toFixed(2)}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-[12px] text-[#78828A]">
              <div>
                <div>Ticket Holder</div>
                <div className="text-black font-medium">
                  {localStorage.getItem("user_name") || "User"}
                </div>
              </div>
              <div className="text-right">
                <div>Date</div>
                <div className="text-black font-medium">
                  {eventDate} at {schedule?.start_time || "TBA"}
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-[#78828A]">
              <div>
                <div>Location</div>
                <div className="text-black font-medium">
                  {event.address}, {event.city}
                </div>
              </div>
              <div className="text-right">
                <div>Seat</div>
                <div className="text-black font-medium">
                  {ticket.seat?.seat_number || "N/A"}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute left-[-19px] top-[28px] w-[38px] h-[38px] bg-white rounded-full" />
              <div className="absolute right-[-19px] top-[28px] w-[38px] h-[38px] bg-white rounded-full" />
              <div className="border-t-2 border-dashed border-[#E3E7EC] w-[265px] mx-auto" />
            </div>

            {/* Barcode area */}
            <div className="mt-6 bg-[#F6F8FE] rounded-md p-4">
              <div className="bg-white rounded-sm flex items-center justify-center p-3">
                <Image
                  src={ticket.qr || "/images/no-qr.png"}
                  alt="QR Code"
                  width={150}
                  height={150}
                  className="object-contain rounded-lg border border-gray-200"
                  unoptimized
                />
              </div>
              <p className="text-center text-[12px] text-[#111111] mt-3 font-medium">
                Scan the QR code
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="w-full max-w-[375px] px-4 mt-6 mb-6">
        <PDFDownloadLink
          document={<TicketPDF booking={booking} ticket={ticket} />}
          fileName={`ticket-${ticket.id}.pdf`}
        >
          {({ loading }) => (
            <Button className="w-full h-[56px] rounded-[24px] bg-[#F41F52] text-white text-[16px] font-semibold">
              {loading ? "Generating..." : "Download Ticket"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
    </div>
  );
}

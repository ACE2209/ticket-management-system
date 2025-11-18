/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  Image as PDFImage,
  StyleSheet,
} from "@react-pdf/renderer";

interface Seat {
  id: string;
  seat_number: string;
  status: string;
}
interface Ticket {
  id: string;
  price: number;
  qr: string;
  seat: Seat;
}
interface EventSchedule {
  id: string;
  start_time: string;
  end_time: string;
  start_checkin_time: string;
  end_checkin_time: string;
}
interface Category {
  id: string;
  name: string;
  description: string;
}
interface Event {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  category: Category;
  preview_image: string;
  event_schedules: EventSchedule[];
}
interface BookingDetail {
  id: string;
  booking_date: string;
  price: number;
  event: Event;
  tickets: Ticket[];
  schedule: EventSchedule | null;
}

// PDF Styles giống ticket
const pdfStyles = StyleSheet.create({
  page: { backgroundColor: "#FEFEFE", padding: 20, fontFamily: "Helvetica" },
  card: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFBFC",
    borderRadius: 24,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E3E7EC",
    display: "flex",
    flexDirection: "column",
  },
  eventHeader: { flexDirection: "row", marginBottom: 10, flexWrap: "wrap" },
  imageContainer: { flexBasis: "45%", position: "relative", marginBottom: 10 },
  image: { width: "100%", height: 100, borderRadius: 16, objectFit: "cover" },
  dateBox: {
    position: "absolute",
    top: 5,
    left: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 4,
    textAlign: "center",
  },
  day: { color: "#F41F52", fontWeight: "bold", fontSize: 14 },
  month: { color: "#F41F52", fontSize: 10, textTransform: "uppercase" },
  eventInfo: { flex: 1, marginLeft: 10, minWidth: 0 },
  eventName: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#111111",
  },
  eventLocation: { fontSize: 13, color: "#66707A", marginBottom: 2 },
  eventTime: { fontSize: 14, color: "#9CA4AB" },
  dashedLine: {
    borderTopWidth: 1,
    borderTopColor: "#E3E7EC",
    borderStyle: "dashed",
    marginVertical: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    flexWrap: "wrap",
  },
  label: { fontSize: 13, color: "#78828A" },
  value: { fontSize: 13, color: "#111111" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
    marginTop: 5,
  },
  totalValue: { color: "#F41F52" },
  qr: {
    width: "100%",
    maxWidth: 128,
    height: 128,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E3E7EC",
    marginTop: 10,
    alignSelf: "center",
  },
});

// PDF Component giống ticket
const BookingPDF = ({ booking }: { booking: BookingDetail }) => {
  const event = booking.event;
  const schedule = booking.schedule || event.event_schedules?.[0];
  const eventDate = schedule?.start_time
    ? new Date(schedule.start_time)
    : new Date(booking.booking_date);
  const day = eventDate.getDate().toString().padStart(2, "0");
  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const location = `${event.address}, ${event.city}`;
  const noteText = "E-ticket valid for single entry only";

  return (
    <Document>
      <Page style={pdfStyles.page}>
        <View style={pdfStyles.card}>
          {/* Event header */}
          <View style={pdfStyles.eventHeader}>
            <View style={pdfStyles.imageContainer}>
              {event.preview_image && (
                <PDFImage src={event.preview_image} style={pdfStyles.image} />
              )}
              <View style={pdfStyles.dateBox}>
                <Text style={pdfStyles.day}>{day}</Text>
                <Text style={pdfStyles.month}>{month}</Text>
              </View>
            </View>
            <View style={pdfStyles.eventInfo}>
              <Text style={pdfStyles.eventName}>{event.name}</Text>
              <Text style={pdfStyles.eventLocation}>{location}</Text>
              <Text style={pdfStyles.eventTime}>
                {schedule?.start_time
                  ? new Date(schedule.start_time).toLocaleString()
                  : ""}
              </Text>
            </View>
          </View>

          {/* Răng cưa */}
          <View style={pdfStyles.dashedLine} />

          {/* Bill content */}
          <View>
            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.label}>Quantity</Text>
              <Text style={pdfStyles.value}>
                {booking.tickets.length} – E Ticket
                {booking.tickets.length > 1 ? "s" : ""}
              </Text>
            </View>

            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.label}>Date Order</Text>
              <Text style={pdfStyles.value}>
                {new Date(booking.booking_date).toLocaleString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>

            <View style={pdfStyles.infoRow}>
              <Text style={pdfStyles.label}>Notes</Text>
              <Text style={pdfStyles.value}>{noteText}</Text>
            </View>

            <View style={pdfStyles.totalRow}>
              <Text>Total</Text>
              <Text style={pdfStyles.totalValue}>
                ${booking.price.toFixed(2)}
              </Text>
            </View>

            {booking.tickets[0]?.qr && (
              <PDFImage src={booking.tickets[0].qr} style={pdfStyles.qr} />
            )}
          </View>
        </View>
        <Text
          style={{
            position: "absolute",
            bottom: 10,
            width: "100%",
            textAlign: "center",
            fontSize: 10,
            color: "black",
          }}
        >
          Tickla!!! Thank you so much for using it
        </Text>
      </Page>
    </Document>
  );
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const raw = await apiFetch(`/bookings/${id}`);
        const event = raw.event_id;
        const bookingItems = raw.booking_items || [];

        const tickets = bookingItems.map((item: any) => ({
          id: item.id,
          price: item.price,
          qr: item.qr,
          seat: {
            id: item.seat_id?.id,
            seat_number: item.seat_id?.seat_number,
            status: item.seat_id?.status,
          },
        }));

        const schedule =
          event?.event_schedules?.[0] ||
          bookingItems?.[0]?.event_schedule_id ||
          null;

        const totalPrice =
          raw.price ??
          raw["price "] ??
          bookingItems.reduce((s: number, it: any) => s + (it.price || 0), 0);

        setBooking({
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
            event_schedules: event.event_schedules || [],
          },
          tickets,
          schedule,
        });
      } catch (err) {
        console.error("❌ Lỗi tải booking:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">Loading booking...</div>
    );
  if (!booking)
    return <div className="text-center mt-10">Booking not found 😢</div>;

  const event = booking.event;
  const schedule = booking.schedule || event.event_schedules?.[0];
  const totalTickets = booking.tickets?.length || 0;
  const eventDate = schedule?.start_time
    ? new Date(schedule.start_time)
    : new Date(booking.booking_date);
  const day = eventDate.getDate().toString().padStart(2, "0");
  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const location = `${event.address}, ${event.city}`;
  const noteText = "E-ticket valid for single entry only";

  return (
    <div className="bg-[#FEFEFE] min-h-screen flex flex-col items-center font-['PlusJakartaSans']">
      {/* Header */}
      <div className="w-full max-w-[420px] px-6 pt-6 pb-4 flex items-center justify-between">
        <div
          onClick={() => router.back()}
          className="w-[40px] h-[40px] bg-[#11111114] rounded-full flex items-center justify-center cursor-pointer"
        >
          <span className="text-[#111111] text-[20px] select-none">←</span>
        </div>

        <h1 className="text-[18px] font-semibold text-[#111111]">
          Order Detail
        </h1>

        <div className="w-[40px] h-[40px] flex items-center justify-center">
          <div className="flex flex-col justify-between h-4">
            <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
            <span className="w-[4px] h-[4px] bg-[#111111] rounded-full"></span>
          </div>
        </div>
      </div>

      {/* Bill container */}
      <div className="relative w-full max-w-[350px] bg-white rounded-[24px] shadow-md mt-4 overflow-hidden border border-[#E3E7EC]">
        <div className="p-5">
          {/* Event header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="relative w-[45%]">
              <Image
                src={event.preview_image || "/images/default-event.jpg"}
                alt={event.name}
                width={200}
                height={200}
                className="w-full h-[150px] object-cover rounded-[16px]"
              />

              <div className="absolute top-2 left-2 bg-white rounded-xl px-2 py-1 text-center shadow-sm">
                <p className="text-[#F41F52] font-bold text-[14px] leading-none">
                  {day}
                </p>
                <p className="text-[#F41F52] text-[10px] uppercase leading-none">
                  {month}
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-[#111111] text-[17px] font-semibold leading-snug mb-1">
                  {event.name}
                </h2>
                <p className="text-[#66707A] text-[13px] mb-1">{location}</p>
                <p className="text-[#9CA4AB] text-[14px]">
                  {schedule?.start_time
                    ? new Date(schedule.start_time).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Răng cưa */}
        <div className="relative flex items-center justify-center my-1">
          <div className="absolute left-[-12px] w-6 h-6 bg-[#FEFEFE] rounded-full"></div>
          <div className="absolute right-[-12px] w-6 h-6 bg-[#FEFEFE] rounded-full"></div>
          <div className="w-full border-t border-dashed border-[#E3E7EC]"></div>
        </div>

        {/* Bill content */}
        <div className="p-5 pt-3 space-y-3 text-[13px] text-[#111111] bg-[#FFFBFC]">
          <div className="flex justify-between">
            <span className="text-[#78828A]">Quantity</span>
            <span>
              {totalTickets} – E Ticket{totalTickets > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#78828A]">Date Order</span>
            <span>
              {new Date(booking.booking_date).toLocaleString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#78828A]">Notes</span>
            <span className="text-right">{noteText}</span>
          </div>

          <div className="border-t border-[#E3E7EC] pt-4 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-[#F41F52]">${booking.price.toFixed(2)}</span>
          </div>

          {/* QR Image */}
          <div className="flex flex-col items-center mt-4">
            {booking.tickets?.[0]?.qr ? (
              <Image
                src={booking.tickets[0].qr}
                alt="QR Code"
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                unoptimized
              />
            ) : (
              <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-gray-400 text-[12px]">No QR</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <PDFDownloadLink
        document={<BookingPDF booking={booking} />}
        fileName={`booking-${booking.id}.pdf`}
      >
        {({ loading }) => (
          <button className="mt-10 mb-10 bg-[#F41F52] text-white font-semibold text-[16px] px-8 py-3 rounded-full shadow-md  ">
            {loading ? "Generating PDF..." : "Download PDF"}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
}

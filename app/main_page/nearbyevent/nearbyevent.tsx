"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';

interface EventDetail {
	id: string;
	name: string;
	description?: string;
	address?: string;
	city?: string;
	country?: string;
	preview_image?: string;
	place?: {
		type: string;
		coordinates: [number, number];
	};
	creator_id?: {
		id: string;
		first_name: string;
		last_name: string;
		avatar?: string;
	};
	category_id?: {
		id: string;
		name: string;
	};
	event_schedules?: {
		id: string;
		start_time: string;
		end_time: string;
	}[];
	tickets?: {
		id: string;
		base_price: number;
	}[];
	seat_zones?: {
		id: string;
		tickets?: {
			id: string;
			base_price: number;
		}[];
	}[];
	bookings?: {
		id: string;
	}[];
	status?: string;
}

interface Category {
	id: string;
	name: string;
}

interface UserLocation {
	lat: number;
	lng: number;
}

export default function NearbyEventPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [events, setEvents] = useState<EventDetail[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string>('all');
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
	const [mapCenter, setMapCenter] = useState({ lat: 21.0285, lng: 105.8542 }); // Default: Hanoi
	const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
	const [initializedFromParams, setInitializedFromParams] = useState(false);

	// Initialize center from URL params (if provided by HeaderBar)
	useEffect(() => {
		const latParam = searchParams?.get('lat');
		const lngParam = searchParams?.get('lng');
		if (latParam && lngParam) {
			const lat = parseFloat(latParam);
			const lng = parseFloat(lngParam);
			if (!isNaN(lat) && !isNaN(lng)) {
				setMapCenter({ lat, lng });
				setInitializedFromParams(true);
			}
		}
	}, [searchParams]);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const loc = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};
					setUserLocation(loc);
					// Only center to geolocation if URL params did not set center
					if (!initializedFromParams) {
						setMapCenter(loc);
					}
				},
				(error) => {
					console.error('Error getting location:', error);
				}
			);
		}
	}, [initializedFromParams]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const categoriesData = await apiFetch('/categories');
				setCategories(categoriesData.data || []);

				const eventsData = await apiFetch(
					'/events?filter[status][_eq]=published&fields=*,category_id.*,event_schedules.*,tickets.*,seat_zones.tickets.*,creator_id.first_name,creator_id.last_name'
				);
				console.log('📍 Fetched events:', eventsData.data);

				if (eventsData.data) {
					eventsData.data.forEach((event: EventDetail) => {
						if (event.place?.coordinates) {
							console.log(`📍 Event "${event.name}" location:`, {
								latitude: event.place.coordinates[1],
								longitude: event.place.coordinates[0],
								address: event.address,
								city: event.city,
								country: event.country,
								place: event.place,
							});
						}
					});
				}

				setEvents(eventsData.data || []);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const filteredEvents = events.filter((event) => {
		const matchesCategory =
			selectedCategory === 'all' || event.category_id?.id === selectedCategory;
		const matchesSearch =
			event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			event.city?.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	const eventsWithLocation = filteredEvents.filter(
		(event) =>
			event.place?.coordinates &&
			event.place.coordinates.length === 2 &&
			!isNaN(event.place.coordinates[0]) &&
			!isNaN(event.place.coordinates[1])
	);

	if (loading) {
		return (
			<div className="w-[375px] h-[812px] bg-[#FEFEFE] flex flex-col items-center justify-center mx-auto gap-4">
				<div className="relative w-16 h-16">
					<div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
					<div className="absolute inset-0 border-4 border-[#F41F52] rounded-full border-t-transparent animate-spin"></div>
				</div>
				<p className="text-[15px] font-medium text-[#111111]">Loading events...</p>
			</div>
		);
	}

	return (
		<div className="relative w-[375px] h-[812px] bg-[#FEFEFE] overflow-hidden mx-auto">
			{/* Status Bar */}
			<div className="absolute w-full h-[44px] top-0 left-0 bg-transparent z-50">
				<div className="absolute right-[13.5px] top-1/2 -translate-y-1/2 flex items-center gap-[5px]">
					{/* Signal */}
					<div className="w-[17px] h-[10.67px] relative">
						<div className="absolute left-0 bottom-0 w-[3px] h-[40%] bg-black rounded-[1.2px]"></div>
						<div className="absolute left-[5px] bottom-0 w-[3px] h-[60%] bg-black rounded-[1.2px]"></div>
						<div className="absolute left-[10px] bottom-0 w-[3px] h-[80%] bg-black rounded-[1.2px]"></div>
						<div className="absolute left-[15px] bottom-0 w-[3px] h-[100%] bg-black rounded-[1.2px]"></div>
					</div>
					{/* WiFi */}
					<div className="w-[15.4px] h-[11.06px] bg-black"></div>
					{/* Battery */}
					<div className="w-[24.5px] h-[11.5px] relative">
						<div className="absolute inset-0 border-[1px] border-black/40 rounded-[2.5px]"></div>
						<div className="absolute right-[2px] top-1/2 -translate-y-1/2 w-[18px] h-[7.67px] bg-black rounded-[1.6px]"></div>
						<div className="absolute right-[-1.5px] top-1/2 -translate-y-1/2 w-[1.5px] h-[4px] bg-black/40 rounded-[0.5px]"></div>
					</div>
				</div>
				<div className="absolute left-[29.5px] top-1/2 -translate-y-1/2 font-bold text-[15px] leading-[19px] tracking-[-0.165px] text-black">
					{new Date().toLocaleTimeString('en-US', {
						hour: '2-digit',
						minute: '2-digit',
						hour12: false,
					})}
				</div>
			</div>

			{/* Map Background */}
			<div className="absolute inset-0 w-full h-full bg-gray-100">
				<iframe
					src={`https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&hl=en&z=14&output=embed`}
					className="w-full h-full"
					style={{ border: 0 }}
					allowFullScreen
					loading="lazy"
					referrerPolicy="no-referrer-when-downgrade"
					title="Nearby Events Map"
				></iframe>
			</div>

			{/* User Location Marker (if available) */}
			{userLocation && (
				<div
					className="absolute z-20"
					style={{
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
					}}
				>
					<div className="relative">
						<div className="absolute inset-0 animate-ping">
							<div className="w-6 h-6 bg-blue-500 rounded-full opacity-75"></div>
						</div>
						<div className="relative w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
					</div>
				</div>
			)}

			{/* Event Markers */}
			{eventsWithLocation.slice(0, 8).map((event) => {
				// Extract coordinates as [lng, lat]
				const longitude = event.place!.coordinates[0];
				const eventLat = event.place!.coordinates[1];
				const eventLng = longitude;

				console.log(`📍 Event "${event.name}" coordinates:`, {
					latitude: eventLat,
					longitude: eventLng,
					place: event.place,
				});

				// Approximate projection from center
				const latDiff = eventLat - mapCenter.lat;
				const lngDiff = eventLng - mapCenter.lng;
				const scale = 3000;
				const xOffset = lngDiff * scale;
				const yOffset = -latDiff * scale;

				const leftPercent = 50 + (xOffset / 375) * 100;
				const topPercent = 50 + (yOffset / 812) * 100;

				const boundedLeft = Math.max(10, Math.min(90, leftPercent));
				const boundedTop = Math.max(15, Math.min(70, topPercent));

				const isSelected = selectedEvent?.id === event.id;

				return (
					<div
						key={event.id}
						className={`absolute cursor-pointer transition-all ${
							isSelected ? 'z-30 scale-125' : 'z-10 hover:scale-110'
						}`}
						style={{
							left: `${boundedLeft}%`,
							top: `${boundedTop}%`,
							transform: 'translate(-50%, -100%)',
						}}
						onClick={(e) => {
							e.stopPropagation();
							const latitude = event.place!.coordinates[1];
							const lng = event.place!.coordinates[0];
							console.log(`🎯 Selected event "${event.name}":`, {
								latitude,
								longitude: lng,
								address: event.address,
								city: event.city,
							});
							setSelectedEvent(event);
							setMapCenter({ lat: latitude, lng });
						}}
					>
						<svg width="32" height="40" viewBox="0 0 32 40" fill="none">
							<path
								d="M16 0C10.48 0 6 4.48 6 10C6 17.5 16 40 16 40C16 40 26 17.5 26 10C26 4.48 21.52 0 16 0Z"
								fill={isSelected ? '#FFA500' : '#F41F52'}
							/>
							<circle cx="16" cy="10" r="5" fill="white" />
							{isSelected && <circle cx="16" cy="10" r="3" fill="#FFA500" />}
						</svg>
						{isSelected && (
							<div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFA500] rounded-full border-2 border-white animate-ping"></div>
						)}
					</div>
				);
			})}

			{/* Event Count Badge */}
			{eventsWithLocation.length > 0 && (
				<div className="absolute top-[250px] right-6 z-20 bg-white rounded-full shadow-lg px-4 py-2 border-2 border-[#F41F52]">
					<div className="flex items-center gap-2">
						<div className="w-2 h-2 bg-[#F41F52] rounded-full animate-pulse"></div>
						<span className="text-[12px] font-bold text-[#111111]">
							{eventsWithLocation.length} Event
							{eventsWithLocation.length > 1 ? 's' : ''}
						</span>
					</div>
				</div>
			)}

			{/* Featured Event Popup */}
			{eventsWithLocation.length > 0 && (selectedEvent || eventsWithLocation[0]) && (
				<div
					className="absolute bottom-[260px] left-[40px] z-20 cursor-pointer"
					onClick={() =>
						router.push(
							`/main_page/detailevent?id=${(selectedEvent || eventsWithLocation[0])!.id}`
						)
					}
				>
					<div className="relative">
						<div className="w-[140px] bg-white rounded-lg shadow-xl overflow-hidden border-2 border-[#F41F52]">
							{(selectedEvent || eventsWithLocation[0]).preview_image ? (
								<div className="relative w-full h-[80px]">
									<Image
										src={(selectedEvent || eventsWithLocation[0]).preview_image!}
										alt={(selectedEvent || eventsWithLocation[0]).name}
										fill
										className="object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).style.display = 'none';
										}}
									/>
								</div>
							) : (
								<div className="w-full h-[80px] bg-gradient-to-br from-[#F41F52] to-[#F9C24B]" />
							)}

							<div className="p-3 bg-white">
								<div className="flex items-start gap-2">
									<div className="w-8 h-8 bg-[#F41F52] rounded-lg flex items-center justify-center flex-shrink-0">
										<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
											<path
												d="M11 2H3C2.45 2 2 2.45 2 3V11C2 11.55 2.45 12 3 12H11C11.55 12 12 11.55 12 11V3C12 2.45 11.55 2 11 2Z"
												fill="white"
												stroke="white"
												strokeWidth="1.5"
											/>
										</svg>
									</div>

									<div className="flex-1 flex flex-col gap-1">
										<div className="text-[10px] font-semibold tracking-wider uppercase text-[#F41F52]">
											{(selectedEvent || eventsWithLocation[0]).category_id?.name ||
												'Event'}
										</div>
										<div className="text-[11px] font-bold text-[#111111] line-clamp-2 leading-tight">
											{(selectedEvent || eventsWithLocation[0]).name}
										</div>
										<div className="text-[9px] text-[#9CA4AB] flex items-center gap-1">
											<svg width="10" height="10" viewBox="0 0 10 10" fill="#9CA4AB">
												<path d="M5 0C3.07 0 1.5 1.57 1.5 3.5C1.5 5.88 5 10 5 10C5 10 8.5 5.88 8.5 3.5C8.5 1.57 6.93 0 5 0Z" />
											</svg>
											<span>
												{(selectedEvent || eventsWithLocation[0]).city ||
													(selectedEvent || eventsWithLocation[0]).address ||
													'Location'}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white border-b-2 border-r-2 border-[#F41F52] rotate-45" />
					</div>
				</div>
			)}

			{/* Header */}
			<div className="absolute top-[60px] left-0 right-0 px-6 z-30 flex items-center justify-between">
				<button
					onClick={() => router.back()}
					className="w-12 h-12 bg-black/8 rounded-full flex items-center justify-center"
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M15 18l-6-6 6-6"
							stroke="#111111"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>

				<h1 className="text-[18px] font-bold leading-[26px] tracking-[0.005em] text-[#111111]">
					Nearby Event
				</h1>

				<button className="w-12 h-12 bg-transparent">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="black">
						<circle cx="12" cy="6" r="2" />
						<circle cx="12" cy="12" r="2" />
						<circle cx="12" cy="18" r="2" />
					</svg>
				</button>
			</div>

			{/* Search Bar */}
			<div className="absolute top-[132px] left-6 right-6 z-30">
				<div className="flex items-center gap-2">
					<div className="flex-1 bg-white rounded-[24px] h-[52px] flex items-center px-4 gap-3 shadow-sm border border-gray-100">
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<circle cx="9" cy="9" r="6.5" stroke="#9CA4AB" strokeWidth="2" />
							<path d="M14 14l4 4" stroke="#9CA4AB" strokeWidth="2" strokeLinecap="round" />
						</svg>
						<input
							type="text"
							placeholder="Search events, locations..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="flex-1 bg-transparent outline-none text-[15px] font-medium text-[#111111] placeholder:text-[#9CA4AB]"
						/>
						{searchQuery && (
							<button
								onClick={() => setSearchQuery('')}
								className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
							>
								<svg width="14" height="14" viewBox="0 0 14 14" fill="#9CA4AB">
									<path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" />
								</svg>
							</button>
						)}
					</div>
					<button
						onClick={() => router.push('/main_page/nearbyevent/list')}
						className="w-[52px] h-[52px] bg-white rounded-[24px] flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
					>
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<rect x="3" y="5" width="14" height="2" rx="1" fill="#111111" />
							<rect x="3" y="9" width="14" height="2" rx="1" fill="#111111" />
							<rect x="3" y="13" width="14" height="2" rx="1" fill="#111111" />
						</svg>
					</button>
				</div>
			</div>

			{/* Categories */}
			<div className="absolute top-[200px] left-6 z-30 overflow-x-auto hide-scrollbar max-w-[calc(100%-48px)]">
				<div className="flex gap-2.5 pr-6">
					<button
						onClick={() => setSelectedCategory('all')}
						className={`px-4 py-2.5 rounded-full text-[13px] font-semibold tracking-tight whitespace-nowrap transition-all shadow-sm ${
							selectedCategory === 'all'
								? 'bg-[#F41F52] text-white scale-105'
								: 'bg-white border border-gray-200 text-[#66707A] hover:border-[#F41F52] hover:text-[#F41F52]'
						}`}
					>
						All Events
					</button>
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => setSelectedCategory(category.id)}
							className={`px-4 py-2.5 rounded-full text-[13px] font-semibold tracking-tight whitespace-nowrap transition-all shadow-sm ${
								selectedCategory === category.id
									? 'bg-[#F41F52] text-white scale-105'
									: 'bg-white border border-gray-200 text-[#66707A] hover:border-[#F41F52] hover:text-[#F41F52]'
							}`}
						>
							{category.name}
						</button>
					))}
				</div>
			</div>

			{/* Bottom Sheet with Event List */}
			<div
				className="absolute bottom-0 left-0 right-0 z-30 bg-white rounded-t-[32px] shadow-[0px_-10px_50px_rgba(0,0,0,0.1)]"
				style={{ height: '405px' }}
			>
				<div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[48px] h-[3px] bg-[#E3E7EC] rounded-full"></div>

				<div className="px-6 pt-[30px] pb-6 h-full overflow-y-auto">
					<div className="flex items-center justify-between mb-5">
						<h3 className="text-[17px] font-bold text-[#111111] leading-[24px] tracking-tight">
							Nearby Events ({filteredEvents.length})
						</h3>
						{filteredEvents.length > 0 && (
							<button
								onClick={() => router.push('/main_page/eventList')}
								className="text-[13px] font-semibold text-[#F41F52] leading-[20px] tracking-tight hover:underline"
							>
								See All
							</button>
						)}
					</div>

					{filteredEvents.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 gap-4">
							<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
								<svg width="40" height="40" viewBox="0 0 40 40" fill="#9CA4AB">
									<path d="M20 5C14.48 5 10 9.48 10 15C10 22.5 20 35 20 35C20 35 30 22.5 30 15C30 9.48 25.52 5 20 5ZM20 18C18.34 18 17 16.66 17 15C17 13.34 18.34 12 20 12C21.66 12 23 13.34 23 15C23 16.66 21.66 18 20 18Z" />
								</svg>
							</div>
							<div className="text-center">
								<p className="text-[15px] font-semibold text-[#111111] mb-1">No Events Found</p>
								<p className="text-[13px] text-[#78828A]">Try adjusting your search or filter</p>
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-4">
							{filteredEvents.slice(0, 8).map((event) => {
								const directTickets = event.tickets || [];
								const zoneTickets = event.seat_zones?.flatMap((sz) => sz.tickets || []) || [];
								const allTickets = [...directTickets, ...zoneTickets];
								const basePrice = allTickets.find((t) => t.base_price > 0)?.base_price || 0;

								const eventDate = event.event_schedules?.[0]?.start_time
									? new Date(event.event_schedules[0].start_time).toLocaleDateString('en-US', {
											day: '2-digit',
											month: 'short',
										})
									: 'TBA';

								const location = event.address
									? `${event.address}${event.city ? ', ' + event.city : ''}`
									: event.city || 'Location TBA';

								const isSelected = selectedEvent?.id === event.id;
								const hasLocation =
									event.place?.coordinates &&
									event.place.coordinates.length === 2 &&
									!isNaN(event.place.coordinates[0]) &&
									!isNaN(event.place.coordinates[1]);

								return (
									<div
										key={event.id}
										className={`flex items-center gap-3 cursor-pointer rounded-2xl p-2 transition-all ${
											isSelected ? 'bg-[#FFF5F0] border-2 border-[#FFA500]' : 'hover:bg-gray-50 border-2 border-transparent'
										}`}
										onClick={() => {
											if (hasLocation) {
												const latitude = event.place!.coordinates[1];
												const longitude = event.place!.coordinates[0];
												console.log(`📌 Clicked event card "${event.name}":`, {
													latitude,
													longitude,
													address: event.address,
													city: event.city,
													place: event.place,
												});
												setSelectedEvent(event);
												setMapCenter({ lat: latitude, lng: longitude });
											} else {
												router.push(`/main_page/detailevent?id=${event.id}`);
											}
										}}
									>
										<div className="relative w-[88px] h-[88px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl overflow-hidden flex-shrink-0">
											{event.preview_image ? (
												<Image
													src={event.preview_image}
													alt={event.name}
													fill
													className="object-cover"
													onError={(e) => {
														(e.target as HTMLImageElement).src = '/images/placeholder-event.png';
													}}
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<svg width="32" height="32" viewBox="0 0 32 32" fill="#9CA4AB">
														<path d="M26 4H6C4.9 4 4 4.9 4 6V26C4 27.1 4.9 28 6 28H26C27.1 28 28 27.1 28 26V6C28 4.9 27.1 4 26 4ZM26 26H6V6H26V26ZM16 11C14.34 11 13 12.34 13 14C13 15.66 14.34 17 16 17C17.66 17 19 15.66 19 14C19 12.34 17.66 11 16 11ZM22 23H10V21C10 19 14 17.9 16 17.9C18 17.9 22 19 22 21V23Z" />
													</svg>
												</div>
											)}
										</div>

										<div className="flex-1 flex justify-between items-start gap-2">
											<div className="flex flex-col gap-1.5 min-w-0 flex-1">
												<div className="flex items-center gap-2">
													<span className="text-[11px] font-medium text-[#F41F52] bg-[#F41F520D] px-2 py-0.5 rounded-full uppercase tracking-wide">
														{event.category_id?.name || 'Event'}
													</span>
													{hasLocation && (
														<span className="text-[9px] font-semibold text-[#FFA500] bg-[#FFA5000D] px-2 py-0.5 rounded-full flex items-center gap-1">
															<svg width="8" height="8" viewBox="0 0 8 8" fill="#FFA500">
																<path d="M4 0C2.62 0 1.5 1.12 1.5 2.5C1.5 4.13 4 8 4 8C4 8 6.5 4.13 6.5 2.5C6.5 1.12 5.38 0 4 0Z" />
															</svg>
															ON MAP
														</span>
													)}
												</div>
												<h4 className="text-[14px] font-bold text-[#111111] leading-tight line-clamp-2">
													{event.name}
												</h4>
												<div className="flex items-center gap-2 text-[11px] text-[#78828A]">
													<div className="flex items-center gap-1">
														<svg width="12" height="12" viewBox="0 0 12 12" fill="#78828A">
															<path d="M6 1C4.07 1 2.5 2.57 2.5 4.5C2.5 6.88 6 11 6 11C6 11 9.5 6.88 9.5 4.5C9.5 2.57 7.93 1 6 1Z" />
														</svg>
														<span className="truncate max-w-[120px]">{location}</span>
													</div>
													<div className="w-1 h-1 bg-[#78828A] rounded-full flex-shrink-0"></div>
													<div className="flex items-center gap-1">
														<svg width="12" height="12" viewBox="0 0 12 12" fill="#78828A">
															<path d="M9.5 2H9V1.5C9 1.22 8.78 1 8.5 1C8.22 1 8 1.22 8 1.5V2H4V1.5C4 1.22 3.78 1 3.5 1C3.22 1 3 1.22 3 1.5V2H2.5C1.67 2 1 2.67 1 3.5V9.5C1 10.33 1.67 11 2.5 11H9.5C10.33 11 11 10.33 11 9.5V3.5C11 2.67 10.33 2 9.5 2ZM9.5 9.5H2.5V5H9.5V9.5Z" />
														</svg>
														<span>{eventDate}</span>
													</div>
												</div>
											</div>

											<div className="px-2.5 py-1.5 bg-[#F41F52] rounded-lg flex-shrink-0">
												<span className="text-[10px] font-bold text-white leading-none whitespace-nowrap">
													{basePrice > 0 ? `${(basePrice / 1000).toFixed(0)}K` : 'FREE'}
												</span>
											</div>
										</div>

										{isSelected && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													router.push(`/main_page/detailevent?id=${event.id}`);
												}}
												className="mt-2 w-full py-2 bg-[#F41F52] text-white text-[12px] font-semibold rounded-lg hover:bg-[#E01040] transition-colors flex items-center justify-center gap-2"
											>
												<svg width="14" height="14" viewBox="0 0 14 14" fill="white">
													<path d="M7 1C3.68 1 1 3.68 1 7C1 10.32 3.68 13 7 13C10.32 13 13 10.32 13 7C13 3.68 10.32 1 7 1ZM7 11.8C4.35 11.8 2.2 9.65 2.2 7C2.2 4.35 4.35 2.2 7 2.2C9.65 2.2 11.8 4.35 11.8 7C11.8 9.65 9.65 11.8 7 11.8Z" />
													<path d="M7.6 4.6H6.4V7.6H9.4V6.4H7.6V4.6Z" fill="white" />
												</svg>
												View Event Details
											</button>
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}


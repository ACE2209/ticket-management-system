import NearbyEventPage from "@/app/main_page/nearbyevent/nearbyevent";
import { Suspense } from "react";

export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<NearbyEventPage />
		</Suspense>
	);
}


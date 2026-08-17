import { createFileRoute } from '@tanstack/react-router';
import { PeopleUnitsPage } from '../components/PeopleUnitsPage';
export const Route=createFileRoute('/condominios_/$publicId/pessoas')({component:Page});
function Page(){const{publicId}=Route.useParams();return <PeopleUnitsPage key={publicId} publicId={publicId}/>;}

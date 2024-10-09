import { useQuery } from '@/hooks/use-query'
import { eden } from '@/lib/eden'
import { Text } from 'react-native'

export default function Home() {
	const { loading, data, error } = useQuery(() => eden.reminders.get())

	if (loading) {
		return <Text>Loading...</Text>
	}

	if (error) {
		return <Text>Error: {JSON.stringify(error, null, 2)}</Text>
	}

	return <Text>{JSON.stringify(data.reminders, null, 2)}</Text>
}

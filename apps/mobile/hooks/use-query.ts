import { useEffect, useState } from 'react'

type UseQueryHandler<D, E> = () => Promise<
	| {
			data: D
			error: null
	  }
	| {
			data: null
			error: E
	  }
>

type UseQueryReturn<D, E> =
	| {
			loading: true
			data: null
			error: null
	  }
	| {
			loading: false
			data: null
			error: E
	  }
	| {
			loading: false
			data: D
			error: null
	  }

export function useQuery<D, E>(
	handler: UseQueryHandler<D, E>,
): UseQueryReturn<D, E> {
	const [result, setResult] = useState<UseQueryReturn<D, E>>({
		loading: true,
		data: null,
		error: null,
	})

	useEffect(() => {
		async function executeQuery() {
			const { data, error } = await handler()

			if (error) {
				return setResult({ loading: false, data: null, error })
			}

			setResult({ loading: false, data: data as D, error: null })
		}

		executeQuery()
	}, [handler])

	return result
}

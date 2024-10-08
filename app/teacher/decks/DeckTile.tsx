import Link from 'next/link'
import React from 'react'

export default function DeckTile({ deck }: { deck: any }) {
  console.log('deck.subdecks: ', deck.subdecks)
  return (
    <div className="w-60 h-72 p-2 shadow-md flex flex-col gap-3">
      <p className="text-xl font-bold border-b-2">{deck.title}</p>
      <div className="flex flex-col gap-2">
        {deck.subdecks.map((subdeck: any) => (
          <p key={subdeck.order} className="">
            {subdeck.title}
          </p>
        ))}
      </div>
      <Link
        href={`/teacher/decks/${deck.id}`}
        className="w-28 h-12 rounded-lg bg-primary-500 flex justify-center items-center text-white text-lg"
      >
        Browse
      </Link>
    </div>
  )
}

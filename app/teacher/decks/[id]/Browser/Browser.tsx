'use client'

import _ from 'lodash'
import { useState } from 'react'
import { Row, GroupedSubdeckRows } from '../page'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef, useEffect } from 'react'
import { addCard, addSubdeck, deleteSubdeck, editSubdeckTitle } from '@/app/actions'
import KebabMenu from './KebabMenu'
import { styleNewWord } from './styleNewWord'
import Toggle from './Toggle'
import Image from 'next/image'
import { Edit, Delete } from 'react-feather'

export default function Browser({ deckRows }: { deckRows: Row[] }) {
  const { courseId } = deckRows[0]
  const groupedSubdeckRows: GroupedSubdeckRows = _.groupBy(deckRows, 'lessonOrder')
  console.log('groupedSubdeckRows: ', groupedSubdeckRows)
  /*
   * Subdeck with the lowest order is selected by default.
   */
  const minSubdeckOrder = _.min(Object.keys(groupedSubdeckRows).map(Number)) as number
  /*
   * Using selectedSubdeckRows as state necessitates updating it when deckRows changes, even when selectedSubdeckOrder does not.
   * An example is when a card is added, which changes deckRows, which causes rerendering even though selectedSubdeckOrder stays the same.
   */
  const [selectedSubdeckOrder, setSelectedSubdeckOrder] = useState(minSubdeckOrder)
  console.log('selectedSubdeckOrder: ', selectedSubdeckOrder)

  return (
    /*
     * An argubaly more logical approach is to add CardList to Subdeck, and conditionally render it based on a isSelected prop.
     * This approach may reduce coupling, and making state management easier.
     * However, it would require a less straight-forward CSS layout method than `grid`.
     */
    <div className="grid grid-cols-[1fr_6fr] grid-rows-[1fr_10fr] gap-2">
      <Subdecks
        groupedSubdeckRows={groupedSubdeckRows}
        courseId={courseId}
        selectedSubdeckOrder={selectedSubdeckOrder}
        setSelectedSubdeckOrder={setSelectedSubdeckOrder}
      />

      {/* 
        We want to reset states (selectedCardRows, specifically) in CardList when selectedSubdeckRows changes without using useEffect.
        Ref: https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
        Ref: https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key
      */}
      <CardList key={selectedSubdeckOrder} selectedSubdeckRows={groupedSubdeckRows[selectedSubdeckOrder]} />
    </div>
  )
}

interface SubdecksProps {
  courseId: number
  groupedSubdeckRows: GroupedSubdeckRows
  selectedSubdeckOrder: number
  setSelectedSubdeckOrder: (order: number) => void
}

function Subdecks({ groupedSubdeckRows, courseId, selectedSubdeckOrder, setSelectedSubdeckOrder }: SubdecksProps) {
  const [isAddingSubdeck, setIsAddingSubdeck] = useState(false)

  return (
    <div className="basis-80 border-r-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {Object.keys(groupedSubdeckRows).map((subdeckOrder) => {
          return (
            <div
              key={subdeckOrder}
              className={`${parseInt(subdeckOrder) === selectedSubdeckOrder ? 'bg-orange-200' : 'hover:bg-orange-100'}`}
            >
              <Subdeck
                courseId={courseId}
                subdeckOrder={parseInt(subdeckOrder)}
                subdeckTitle={groupedSubdeckRows[subdeckOrder][0].lessonTitle as string}
                setSelectedSubdeckOrder={setSelectedSubdeckOrder}
              />
            </div>
          )
        })}
      </div>
      {!isAddingSubdeck ? (
        <Button
          variant="outline"
          className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
          onClick={() => setIsAddingSubdeck(true)}
        >
          Add subdeck
        </Button>
      ) : (
        <AddSubdeckForm
          courseId={courseId}
          order={Object.keys(groupedSubdeckRows).length}
          setIsAddingSubdeck={setIsAddingSubdeck}
        />
      )}
    </div>
  )
}

interface SubdeckProps {
  courseId: number
  subdeckOrder: number
  subdeckTitle: string
  setSelectedSubdeckOrder: (order: number) => void
}

function Subdeck({ courseId, subdeckOrder, subdeckTitle, setSelectedSubdeckOrder }: SubdeckProps) {
  const [isEditingSubdeckTitle, setIsEditingSubdeckTitle] = useState(false)
  const editSubdeckTitileInputRef = useRef<HTMLInputElement>(null)
  const [newSubdeckTitle, setNewSubdeckTitle] = useState(subdeckTitle)

  useEffect(() => {
    if (isEditingSubdeckTitle && editSubdeckTitileInputRef.current) {
      editSubdeckTitileInputRef.current.focus()
    }
  }, [isEditingSubdeckTitle])

  const menuOptions = [
    { label: 'Edit', icon: <Edit />, onSelect: () => setIsEditingSubdeckTitle(true) },
    { label: 'Delete', icon: <Delete />, onSelect: () => deleteSubdeck(courseId, subdeckOrder) },
  ]

  return (
    <div>
      {!isEditingSubdeckTitle ? (
        <div className={`m-1 rounded flex justify-between items-center`}>
          <p onClick={() => setSelectedSubdeckOrder(subdeckOrder)} className="flex-1 cursor-pointer p-2 rounded">
            {subdeckTitle}
          </p>
          <KebabMenu menuOptions={menuOptions} />
        </div>
      ) : (
        <div className="flex">
          <form action={editSubdeckTitle} onSubmit={() => setIsEditingSubdeckTitle(false)} className="flex-1">
            <Input type="hidden" name="courseId" value={courseId} />
            <Input type="hidden" name="order" value={subdeckOrder} />
            <Input
              name="title"
              ref={editSubdeckTitileInputRef}
              value={newSubdeckTitle}
              onChange={(e) => setNewSubdeckTitle(e.target.value)}
            />
          </form>
          <Button
            variant="outline"
            className="w-20 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
            onClick={() => {
              setIsEditingSubdeckTitle(false)
              setNewSubdeckTitle(subdeckTitle)
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )

  function onSelect(action: 'edit' | 'delete') {
    console.log('onSelect: ', action)
    switch (action) {
      case 'edit':
        setIsEditingSubdeckTitle(true)
        break
      case 'delete':
        deleteSubdeck(courseId, subdeckOrder)
        break
      default:
        break
    }
  }
}

interface AddSubdeckFormProps {
  courseId: number
  order: number
  setIsAddingSubdeck: React.Dispatch<React.SetStateAction<boolean>>
}

function AddSubdeckForm({ courseId, order, setIsAddingSubdeck }: AddSubdeckFormProps) {
  const addSubdeckInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => addSubdeckInputRef.current!.focus(), [])

  return (
    <div>
      <form action={addSubdeck} onSubmit={() => setIsAddingSubdeck(false)}>
        <Input type="hidden" name="courseId" value={courseId} />
        <Input type="hidden" name="order" value={order} />
        <Input name="title" ref={addSubdeckInputRef} placeholder="Enter the subdeck title and press Return." />
      </form>
      <Button
        variant="outline"
        className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
        onClick={() => setIsAddingSubdeck(false)}
      >
        Cancel
      </Button>
    </div>
  )
}

function CardList({ selectedSubdeckRows }: { selectedSubdeckRows: Row[] }) {
  console.log('CardList: selectedSubdeckRows = ', selectedSubdeckRows)
  const groupedCardRows = hasCard(selectedSubdeckRows) ? _.groupBy(selectedSubdeckRows, 'cardOrder') : undefined
  console.log('CardList: groupedCardRows = ', groupedCardRows)
  const [selectedCardRows, setSelectedCardRows] = useState<Row[]>(groupedCardRows ? getFirstCard(groupedCardRows) : [])

  const [isAddingCard, setIsAddingCard] = useState(false)
  const addCardTextInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="grid grid-cols-[1fr_2fr]">
      <div className="border-r-4">
        {/*
         * Card list is defined inline here, as extracting it to a separate component would introduce tight coupling regarding the state management of selectedCardRows.
         */}
        {groupedCardRows && (
          <ul className="flex flex-col gap-2">
            {Object.keys(groupedCardRows).map((cardOrder) => (
              <li
                className={`p-2 rounded cursor-pointer ${selectedCardRows.length > 0 && selectedCardRows[0].cardOrder === parseInt(cardOrder) ? 'bg-orange-200' : 'hover:bg-orange-100'}`}
                key={cardOrder}
                onClick={() => setSelectedCardRows(groupedCardRows[cardOrder])}
                dangerouslySetInnerHTML={{
                  __html: styleNewWord(groupedCardRows[cardOrder][0].cardText as string),
                }}
              ></li>
            ))}
          </ul>
        )}
        {!isAddingCard && (
          <Button
            variant="outline"
            className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
            onClick={() => setIsAddingCard(true)}
          >
            Add card
          </Button>
        )}
        {isAddingCard && (
          <div>
            <form action={addCard} onSubmit={() => setIsAddingCard(false)}>
              <Input type="hidden" name="courseId" value={selectedSubdeckRows[0].courseId} />
              <Input type="hidden" name="lessonOrder" value={selectedSubdeckRows[0].lessonOrder as number} />
              <Input type="hidden" name="order" value={groupedCardRows ? Object.keys(groupedCardRows).length : 0} />
              <Input name="text" ref={addCardTextInputRef} placeholder="Enter the card text and press Return." />
            </form>
            <Button
              variant="outline"
              className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
              onClick={() => setIsAddingCard(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      {selectedCardRows.length > 0 && <Card selectedCardRows={selectedCardRows} />}
    </div>
  )
}

type GroupedCardRows = {
  [key: string]: Row[]
}

function getFirstCard(groupedCardRows: GroupedCardRows) {
  return groupedCardRows[_.min(Object.keys(groupedCardRows).map(Number)) as number]
}

function hasCard(selectedSubdeckRows: Row[]) {
  return selectedSubdeckRows[0]['cardOrder'] !== null
}

function Card({ selectedCardRows }: { selectedCardRows: Row[] }) {
  console.log('selectedCardRows: ', selectedCardRows)
  const [isEdit, setIsEdit] = useState(false)
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="self-end">
        <Toggle
          isChecked={isEdit}
          onChange={() => {
            setIsEdit(!isEdit)
          }}
        />
      </div>
      {isEdit ? <EditCard selectedCardRows={selectedCardRows} /> : <PreviewCard selectedCardRows={selectedCardRows} />}
    </div>
  )
}

function EditCard({ selectedCardRows }: { selectedCardRows: Row[] }) {
  console.log('selectedCardRows: ', selectedCardRows)
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <input
        className="w-3/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
        value={selectedCardRows[0].cardText as string}
      />
      <div className="w-full h-1 bg-gray-200"></div>
      {selectedCardRows.map((wordRow, index) => (
        <div key={index} className="flex flex-col items-center">
          <div>
            <span className="font-bold text-primary-600">{wordRow.wordText}</span>
            <span className=""> :: {wordRow.wordDefinition}</span>
          </div>
          {wordRow.wordImageUri && (
            <Image src={wordRow.wordImageUri} alt={wordRow.wordText as string} width={200} height={100}></Image>
          )}
        </div>
      ))}
    </div>
  )
}

function PreviewCard({ selectedCardRows }: { selectedCardRows: Row[] }) {
  console.log('selectedCardRows: ', selectedCardRows)
  return (
    <div className="w-full pl-3 flex flex-col items-center gap-3">
      <p
        className="text-center text-lg"
        dangerouslySetInnerHTML={{
          __html: styleNewWord(selectedCardRows[0].cardText as string),
        }}
      ></p>
      <div className="w-full h-1 bg-gray-200"></div>
      {selectedCardRows.map((wordRow, index) => (
        <div key={index} className="flex flex-col items-center">
          <div>
            <span className="font-bold text-primary-600">{wordRow.wordText}</span>
            <span className=""> :: {wordRow.wordDefinition}</span>
          </div>
          {wordRow.wordImageUri && (
            <Image src={wordRow.wordImageUri} alt={wordRow.wordText as string} width={200} height={100}></Image>
          )}
        </div>
      ))}
    </div>
  )
}

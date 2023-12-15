import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'
import CardDetails from './CardDetails'
import { Draggable, Droppable } from '@hello-pangea/dnd'
import { getContrastTextColor } from '@/lib/utils';
interface props {
  cards: any[],
  id: string;
  listTitle: string
}
const CardsContainer = ({ cards, id, listTitle }: props) => {

  return (
    <Droppable droppableId={id} type="card">
      {(provided) => (
        <div className={`w-full ${cards && cards.length > 0 && 'grid gap-2.5 my-4'}`}
          ref={provided.innerRef}
          {...provided.droppableProps}>
          {cards && cards.length > 0 ? cards.map((item, index) => {
            return (
              <Draggable draggableId={item.id} index={index} key={item.id}>
                {(provided) => (
                  <Dialog>
                    <DialogTrigger>
                      <div className='text-left border-2 border-transparent hover:border-gray-600 py-2 px-3 bg-white rounded-md shadow-sm cursor-pointer '
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}>
                          {item.label && item.labelColor && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-sm`} style={{ color: getContrastTextColor(item.labelColor), background: item.labelColor || "#000" }}>{item.label || 'Add label'}</span>
                          )}
                        <p className={`font-medium truncate text-sm ${item.label && item.labelColor && 'mt-1'}`}>{item.title}</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className='max-w-2xl'>
                      <CardDetails data={item} listId={id} listTitle={listTitle} />
                    </DialogContent>
                  </Dialog>
                )}
              </Draggable>
            )
          }) : (
            <Draggable draggableId={"1"} index={1} key={1}>
              {(provided) => (

                <div className='h-2.5'
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}>
                </div>

              )}
            </Draggable>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export default CardsContainer
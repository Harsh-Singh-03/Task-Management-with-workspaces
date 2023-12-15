"use client"
import AddList from "@/components/Forms/AddList"
import ListHeader from "./ListHeader";
import AddCard from "@/components/Forms/AddCard";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Separator } from "@/components/ui/separator";
import CardsContainer from "./Cards";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { updateListOrder } from "@/actions/List";
import { updataCardOrder } from "@/actions/Card";

interface list {
    id: string,
    title: string,
    boardId: string,
    order: number,
    cards: any[]
}
interface props {
    orgId: string,
    boardId: string;
    lists: list[];
}
const ListContainer = ({ orgId, boardId, lists }: props) => {
    const [orderedData, setOrderedData] = useState(lists);
    const [cardOpenId, setCardOpenId] = useState("")
    const [placeHolderIndex, setPlaceHolderIndex] = useState(-1)
    const { toast } = useToast()

    useEffect(() => {
        setOrderedData(lists)
    }, [lists])

    function reorder<T>(list: T[], startIndex: number, endIndex: number) {
        // Create a shallow copy of the input array
        const result = Array.from(list);
        // Remove the element at the startIndex from the copied array and store it in the 'removed' variable
        const [removed] = result.splice(startIndex, 1);
        // Insert the removed element at the endIndex in the copied array
        result.splice(endIndex, 0, removed);
        // Return the modified array
        return result;
    };
    const cardOpen = (id: string) => {
        setCardOpenId(id)
    }
    const ondragstart = (result: any) => {
        if (result.type === 'list') {
            setPlaceHolderIndex(result.source.index)
        }
    }
    const ondragEnd = async (result: any) => {
        const { destination, source, type } = result;
        if (!destination) { setPlaceHolderIndex(-1); return; }
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            setPlaceHolderIndex(-1)
            return;
        }
        if (type === "list") {
            setPlaceHolderIndex(destination.index)
            const items = reorder(
                orderedData,
                source.index,
                destination.index,
            ).map((item, index) => ({ ...item, order: index + 1 }));

            setOrderedData(items);
            try {
                const data = await updateListOrder(boardId, orgId, items)
                if (data.success) toast({ title: data.message })
                if (!data.success) toast({ title: data.message, variant: 'destructive' })
            } catch (error) {
                toast({ title: 'Server error', variant: 'destructive' })
            } finally {
                setPlaceHolderIndex(-1)
                return;
            }
            // executeUpdateListOrder({ items, boardId });
        }
        if (type === 'card') {
            let newOrderedData = [...orderedData];
            // Source and destination list
            const sourceList = newOrderedData.find(list => list.id === source.droppableId);
            const destList = newOrderedData.find(list => list.id === destination.droppableId);
            if (!sourceList || !destList) return
            // Check if cards exists on the sourceList
            if (!sourceList.cards)  sourceList.cards = [];
            // Check if cards exists on the destList
            if (!destList.cards) destList.cards = [];
            // Moving the card in the same list
            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index,
                );
                reorderedCards.forEach((card, idx) => {
                    card.order = idx + 1;
                });
                sourceList.cards = reorderedCards;
                setOrderedData(newOrderedData);
                try {
                    const data = await updataCardOrder(orgId, boardId, reorderedCards)
                    if (data.success) toast({ title: data.message })
                    if (!data.success) toast({ title: data.message, variant: 'destructive' })
                } catch (error) {
                    toast({ title: 'Server error', variant: 'destructive' })
                } finally {
                    return;
                }
            }else{
                const [movedCard] = sourceList.cards.splice(source.index, 1);
                // Assign the new listId to the moved card
                movedCard.listId = destination.droppableId;
                // Add card to the destination list
                destList.cards.splice(destination.index, 0, movedCard);
        
                sourceList.cards.forEach((card, idx) => {
                  card.order = idx + 1;
                });
        
                // Update the order for each card in the destination list
                destList.cards.forEach((card, idx) => {
                  card.order = idx + 1;
                });
        
                setOrderedData(newOrderedData);
                try {
                    const data = await updataCardOrder(orgId, boardId, destList.cards)
                    if (data.success) toast({ title: data.message })
                    if (!data.success) toast({ title: data.message, variant: 'destructive' })
                } catch (error) {
                    toast({ title: 'Server error', variant: 'destructive' })
                } finally {
                    return;
                }
            }

        }
    }

        return (
            <DragDropContext onDragEnd={ondragEnd} onDragStart={ondragstart}>
                <Droppable droppableId="lists" type="list" direction="horizontal">
                    {(provided) => (
                        <div className="w-full flex gap-4 md:gap-6 pt-36 px-4 md:px-6 z-10 overflow-x-scroll min-h-screen"
                            {...provided.droppableProps}
                            ref={provided.innerRef}   >
                            {orderedData && orderedData.length > 0 && orderedData.map((item, index) => {
                                return (
                                    <Draggable draggableId={item.id} index={index} key={item.id}>
                                        {(provided) => (
                                            <div key={index} className="w-auto"
                                                {...provided.draggableProps}
                                                ref={provided.innerRef}>
                                                <div className={`transition card min-w-[280px] max-w-[280px] md:min-w-[320px] custom-max-height ${placeHolderIndex === index && 'opacity-80'}`}
                                                    {...provided.dragHandleProps}>
                                                    <ListHeader listTitle={item.title} id={item.id} orgId={orgId} boardId={boardId} cardOpen={cardOpen} />
                                                    {!item.cards || item.cards.length < 1 && (
                                                        <Separator className="mt-2.5 bg-gray-300" />
                                                    )}
                                                    <CardsContainer cards={item.cards || []} id={item.id} listTitle={item.title} />
                                                    <AddCard orgId={orgId} boardId={boardId} listId={item.id} isOpen={cardOpenId === item.id} cardOpen={cardOpen} />
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                            <AddList orgId={orgId} boardId={boardId} />
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }

    export default ListContainer
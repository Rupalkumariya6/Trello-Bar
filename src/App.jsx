import { useState } from 'react';
import './App.css';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";

const item1 = {
    id: v4(),
    name: "Learn how to integrate API"
}

const App = () => {
    const [input, setInput] = useState("")

    const [state, setState] = useState({
        "pending": {
            title: "Pending",
            items: [item1]
        },
        "working": {
            title: "Working",
            items: []
        },
        "done": {
            title: "Done",
            items: []
        }
    })

    const DragEnd = ({ source, destination }) => {
        if (!destination) {
            return
        }

        if (source.index === destination.index && source.droppableId === destination.draggableId) {
            return
        }

        const itemCopy = { ...state[source.droppableId].items[source.index] }

        setState(prev => {
            prev = { ...prev }
            prev[source.droppableId].items.splice(source.index, 1)
            prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)

            return prev
        })
    }

    const addItem = () => {
        setState(prev => {
            return {
                ...prev,
                pending: {
                    title: "Pending",
                    items: [
                        {
                            id: v4(),
                            name: input
                        },
                        ...prev.pending.items
                    ]
                }
            }
        })

        setInput("");
    }

    return (
        <>
            <div className='Input'>
                <input
                    className="input-text text"
                    type="text" placeholder="Enter Task" value={input} onChange={(e) => setInput(e.target.value)} />
                <button className='input-text ' onClick={addItem}>Add Task</button>
            </div>
            <div className="App">
                <DragDropContext onDragEnd={DragEnd}>
                    {_.map(state, (data, key) => {
                        return (
                            <div key={key} className={"column"}>
                                <h3 className='text-center mt-2'>{data.title}</h3>
                                <Droppable droppableId={key}>
                                    {(provided) => {
                                        return (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className={"droppable-col"}
                                            >
                                                {data.items.map((element, index) => {
                                                    return (
                                                        <Draggable key={element.id} index={index} draggableId={element.id}>
                                                            {(provided, snapshot) => {
                                                                console.log(snapshot)
                                                                return (
                                                                    <div
                                                                        className={`item ${snapshot.isDragging && "dragging"}`}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        {element.name}
                                                                    </div>
                                                                )
                                                            }}
                                                        </Draggable>
                                                    )
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        )
                                    }}
                                </Droppable>
                            </div>
                        )
                    })}
                </DragDropContext>
            </div>
        </>
    );
}

export default App;


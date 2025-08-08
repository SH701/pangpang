export default function ChatroomPage({ params }: { params: { id: string } }) {
  return <div>채팅방 ID: {params.id}</div>
}
import {Spin} from 'antd'

export default function Loading() {
  return (
    <main>
        <Spin size='large'/>
        <p>Carregandoa página...</p>
    </main>
  )
}

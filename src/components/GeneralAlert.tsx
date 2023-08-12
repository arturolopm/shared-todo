interface Props {
  advise: string
  close: any
}
const GeneralAlert: React.FC<Props> = ({ advise, close }) => {
  return (
    <div className='todoapp alert'>
      <div
        onClick={() => close()}
        className='align-rigth'>
        x
      </div>

      <div>{advise}</div>

      <button
        onClick={() => close()}
        className='darkbtn'>
        close
      </button>
    </div>
  )
}

export default GeneralAlert

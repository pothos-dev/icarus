import { zipObj } from 'ramda'
import { IUnitType, IUnit } from '../models'
import { storeState, fetchState } from '../lib/persistState'

const units: IUnitType[] = [
  {
    unitTypeId: 'caveman',
    svgPath:
      'M159.1 25.62l-3.5 12.53 134.9 36.28 4.4-13.19zM316.4 54.6l-8.6 25.73c14.6 13.43 29.6 14.58 47.1 13.07l6-29.18c-12.6-6.91-27.8-9.25-44.5-9.62zm128 27.27l-29.6 8.09-4.7 17.24 23.8 23 52.1-11.7zm-68.5.58L373 96.57l19.6 5.33 3.8-14.07zm-174.6 7.46c-7.3.18-14.4 3.61-20.7 9.95-7 7.24-12.4 18.24-13.9 31.04s1.4 24.7 6.7 33.3c5.4 8.4 12.7 13.5 21.1 14.4 8.4.8 16.7-2.6 23.8-9.9 7-7.2 12.5-18.2 14-31.1 1.4-12.7-1.5-24.6-6.8-33.1-5.4-8.55-12.7-13.61-21-14.47-1-.11-2.1-.15-3.2-.12zm113.3 16.39c-4.6 33.6-11.8 60.1-22 88.3l-27.5-3.6c-.4 15-2.4 30-7.5 45.2 20.6-.5 40.2-2.8 59.3-11.3 11.3-37.8 18.4-75.3 24.3-112.9-8.9-.4-17.8-1.9-26.6-5.7zm-174.1 76.9c-8.7 0-15.5.7-26.6 4.1-26.62 16.2-45.72 40.2-53 57.9-8.4 20.9-11.67 47-11.26 70.5l25.64 3.2c3.41-24 4.92-41.7 10.83-60.8l47.29-34-2.9 45.9 7.5-2.3c18-9.1 30.5-20.7 41.3-34.1 9.4-11.6 17.3-24.5 25.7-37.5-4.1.8-8.2 1-12.5.6-10.5-1-19.6-5.9-26.9-13.1-10.9 0-18.7-.4-25.1-.4zm106.1 4.8l-13.7.2c-12.9 17-23.3 36.5-37.9 55 6.4 2.3 11.4 8.4 11.5 13.9-.9 10.3-10.6 15-19 15.1-6.1-.4-11-2-15-5.6-12.1 10-26.8 18.8-45.4 25.2.2 2.4.5 4.9.6 7.3 3.1-1 6.3-1.5 9.8-1.5 11.5.3 23.1 7.4 23.3 18.1-1.3 12.4-13.3 18-23.3 18.1-3.7 0-7.2-.6-10.3-1.8-.9 7.5-2.5 15.1-5.1 22.7l27 2.5 5.8 29.4 24.9-23 12.5 32.3c5.4-10.2 11-20.4 17.2-30.4-11.3-.2-23.6-6.5-23.9-16.7 1.3-12.5 14.3-16.7 24-16.8 7.3.4 13.8 1.8 19 6.2 7.8-9.8 16.6-19.1 26.4-27.8-1.3-3.4-3-7-5.1-10.6-3 .8-6.4 1.2-9.9 1.2-10.2-1.1-22.7-3.5-22.9-14.5.4-6.3 4.9-10.2 9.9-12.3 1.3-.5 2.7-.9 4.1-1.2-2.7-3.5-5.1-6.5-7.8-10.1l3.7-5.5c15.5-23.2 19.4-45.3 19.6-69.4zm4.2 152c-8 8.9-15 18.3-21.6 28.3 4.5 3.8 9.4 7.8 14.2 11.9 9.4 8 19.2 17 21.7 30.3l14.4 75.9 27.8-10.4c-3.6-28.8-5.3-48.9-12.7-81.3v-.3l-.1-.3c-1.6-10-10.3-20.4-21.8-31.6-7.1-7-15.1-14.3-21.9-22.5zM126 373.4l-20 50.1c-24.75 5.4-51.43 1-72.64-3.4l-7.39 23.7c32.23 6.1 74.93 10.2 97.83 5.9l18.8-31.1-8.8-44.5z',
    movePoints: 2,
    hitPoints: 50,
    attackRangeCutOff: 3,
    attackRangeMax: 6,
    attackDamage: 5,
  },
  {
    unitTypeId: 'assassin',
    svgPath:
      'M332.031 66.13c-28.807-.01-55.439 14.149-67.88 40.65 20.79 1.744 16 55.07 16 55.07-11.814 16.687-24.73 33.186-36.589 50.146 0 0-99.046 132.283-178.378 168.025-28.049 22.593-33.305 36.532-44.137 52.649-4.877 9.54 9.257 14.324 11.701 13.2 22.726-10.461 25.176-20.866 47.07-35.675 12.805-5.026 23.839-15.9 31.854-11.049 34.962 20.86 107.556 44.28 118.271 38.706 17.857-9.263-5.78-43.585 16.174-89.057 31.97-3.352 58.916-.885 88.332-12.094 3.483 50.279 10.106 54.59 6.766 107.092l71.2 1.045.698-14.61-41.814-11.105c11.528-56.054 11.816-78.996 4.672-127.996-.956-6.622-53.746-8.275-81.012-3.79 24.449-24.202 40.274-45.24 47.506-68.44l.027.189c7.637 15.923 30.083 33.958 35.336 37.125 27.704 11.048 38.214 7.982 62.955 3.887 4.907-.784 27.47 24.537 44.807 9.597 2.642-20.238 16.522-20.369-4.938-32.71-4.847-2.73-27.063 7.462-31.418 6.898-20.21-2.481-30.954-5.211-58.45-12.703-10.23-13.187-32.676-56.136-55.43-59.744 6.535-14.15 28.226-53.108 73.664-66.237-20.943-26.54-49.925-39.057-76.987-39.068zm82.405 46.722c-46.658 19.516-58.266 50.4-58.266 50.4l9.916 7.644s9.646-4.765 48.35-58.044zm23.04 160.005l-4.658 11.418c5.233-.083 10.425.47 15.328 1.608-12.774 30.856-23.938 59.635-28.181 93.094l-.908 7.558 4.863-5.889c20.805-25.671 32.303-55.25 44.95-85.78 4.203 2.656 8.24 5.885 12.071 9.35l4.78-11.374-20.518-8.526-31.767 66.579 24.062-69.713-20.021-8.325z',
    movePoints: 3,
    hitPoints: 20,
    attackRangeCutOff: 1,
    attackRangeMax: 1,
    attackDamage: 15,
  },
  {
    unitTypeId: 'reaper',
    svgPath:
      'M171.125 20.28c-3.678.004-7.287.027-10.844.095l-5.718.125-2.5 5.125c-6.484 13.307-23.588 23.72-45.937 31.625-8.73 3.088-18.122 5.803-27.72 8.313l9.657 16.812c8.253-2.24 16.435-4.714 24.313-7.5 22.043-7.795 42.253-18.258 53.375-35.813 54.302-.54 123.166 6.728 181.688 29.126 54.774 20.963 99.65 54.383 117.812 106.624-2.063-.668-4.205-1.333-6.313-2l-63.28-52.593-25.876 30-43.124-46.47-23.156 34.313-45.28-45.907-27.908 38.125-46-45.81-23.78 45.124-38.782-27.72-7.406 26.282 23.594 41.094c13.6-7.09 32.617-14.47 49.875-17.72 12.606-2.37 24.367-2.552 32.093-.31 7.727 2.24 11.237 5.162 12.656 13l1.813 9.968 9.78-2.594c74.608-19.777 168.01 4.457 231.97 26.437l15.78 5.44-3.624-16.314C472.78 117.786 417.833 75.1 354.126 50.72c-59.725-22.86-127.835-30.473-183-30.44zM40.72 50.313c-12.622.486-23.765 10.62-23.376 28.626 94.07 133.71 175.316 272.647 239.47 417.562h41.436L52.406 53.22c-2.063-.898-4.34-1.96-6.437-2.345-1.836-.336-3.45-.637-5.25-.563zM382.75 255.97c-8.857.08-17.908 1.26-26.97 3.686-55.227 14.784-88.043 69.08-74.342 120.156 3.257 12.147 14.716 25.216 29.468 36.344 10.09 7.61 21.485 14.305 32.063 19.72-2.054-13.744-5.87-27.03-13.064-39.938l16.313-9.094c18.71 33.585 17.717 68.118 18.03 100.906 9.32 1.53 18.46 3.04 27.47 4.188l1.842-34 18.657 1-1.876 34.78c11.114.645 22.016.378 32.75-1.406l-1.656-35.375 18.687-.843 1.438 31.47c6.713-2.395 13.364-5.54 19.968-9.627.64-5.552 2.86-25.628 4.033-53.968.565-13.672.764-28.563.312-43.095-15.635 4.024-31.625-5.263-35.813-20.875-4.212-15.705 5.12-31.853 20.844-36.063 2.457-.657 4.944-.975 7.375-1h.064C465.917 283.512 428.73 257.113 386.53 256c-1.256-.033-2.515-.043-3.78-.03zm4.72 70.936c15.152-.15 29.052 9.89 33.155 25.188 4.863 18.13-5.88 36.766-24.03 41.625-18.153 4.858-36.826-5.903-41.69-24.033-4.86-18.13 5.912-36.766 24.064-41.625 2.835-.76 5.693-1.128 8.5-1.156zm51.936 46.188L465 426.72l-38.563 6.06 12.97-59.686z',
    movePoints: 2,
    hitPoints: 40,
    attackRangeCutOff: 1,
    attackRangeMax: 2,
    attackDamage: 50,
  },
  {
    unitTypeId: 'machinegun',
    svgPath:
      'M201.607 102.77c.08-3.119.01-6.214-.183-9.274l54.291 65.964a36.619 36.619 0 0 1 6.109 10.657 37.024 37.024 0 0 1 1.69 6.148 38.273 38.273 0 0 1-2.357 21.57 38.643 38.643 0 0 1-8.229 12.322 38.18 38.18 0 0 1-12.238 8.242 37.093 37.093 0 0 1-11.189 2.764q-1.775.153-3.6.136-.907-.015-1.794-.066-.887-.052-1.766-.15-.88-.099-1.74-.234-.858-.135-1.71-.305l-83.581-17.189.537-.232a109.821 109.821 0 0 0 33.429-23.781 116.196 116.196 0 0 0 23.158-34.754 111.765 111.765 0 0 0 9.173-41.818zm52.265 25.309l16.134 19.594a55.27 55.27 0 0 1 11.699 25.272 56.958 56.958 0 0 1-33.935 62.542 55.535 55.535 0 0 1-16.76 4.138 59.787 59.787 0 0 1-5.382.208 52.376 52.376 0 0 1-2.69-.094 47.843 47.843 0 0 1-2.656-.224c-.88-.098-1.76-.208-2.62-.343a62.808 62.808 0 0 1-2.583-.463l-55.717-11.46-1.254 23.334 128.059-.345 1.368-124.617zm87.127 54.31l-.035-.415a10.332 10.332 0 0 0-.296-1.136 9.348 9.348 0 0 0-.445-1.123c-.01-.115-.11-.21-.166-.31-.055-.1-.26-.466-.396-.686l-.212-.307a7.706 7.706 0 0 0-.48-.597l-.22-.249a7.243 7.243 0 0 0-.768-.7 7.08 7.08 0 0 0-1.69-1.016 8.238 8.238 0 0 0-3.808-.52l-.265.023-.472.041a12.565 12.565 0 0 0-3.981 1.376 16.198 16.198 0 0 0-2.437 1.639 17.852 17.852 0 0 0-1.563 1.4 18.442 18.442 0 0 0-3.124 4.183 16.776 16.776 0 0 0-1.232 2.95 14.96 14.96 0 0 0-.472 1.934 11.905 11.905 0 0 0 .079 4.697c.016.184.1.351.15.532a8.654 8.654 0 0 0 1.629 3.135 7.752 7.752 0 0 0 2.383 1.92 7.96 7.96 0 0 0 .93.408l.323.111q.394.129.796.21l.366.073a9.06 9.06 0 0 0 .938.105l.265-.023a9.87 9.87 0 0 0 1.159-.03l.173-.015a11.975 11.975 0 0 0 4.453-1.417 15.596 15.596 0 0 0 3.886-3.017 17.713 17.713 0 0 0 2.926-4.189 16.73 16.73 0 0 0 1.586-4.91c.075-.482.115-.961.144-1.428l-.04-.461c-.014-.162.004-.628-.01-.929-.015-.3-.028-.322-.041-.472-.013-.15.038-.503-.01-.789zm7.024 41.097l-.04-.462c-.026-.3-.132-.592-.203-.876-.071-.284-.022-.254-.102-.375a10.575 10.575 0 0 0-.422-1.125 9.788 9.788 0 0 0-.56-1.113l-.189-.297a9.022 9.022 0 0 0-.488-.678l-.258-.303c-.18-.205-.371-.398-.562-.59l-.24-.235a8.48 8.48 0 0 0-.885-.69 8.33 8.33 0 0 0-1.797-.914 9.152 9.152 0 0 0-3.932-.486l-.542.047a12.067 12.067 0 0 0-4.21 1.408 14.462 14.462 0 0 0-2.194 1.5 15.527 15.527 0 0 0-1.579 1.484 15.804 15.804 0 0 0-2.737 4.091 14.485 14.485 0 0 0-1.012 3.072 13.317 13.317 0 0 0-.26 1.706 11.477 11.477 0 0 0 .536 4.599c.093.27.196.529.31.774a9.383 9.383 0 0 0 1.856 2.802 8.967 8.967 0 0 0 2.646 1.874 9.117 9.117 0 0 0 .95.382l.346.099q.404.116.842.206l.39.07a9.719 9.719 0 0 0 .972.103l.265-.023a10.413 10.413 0 0 0 1.159-.03l.196-.017a11.06 11.06 0 0 0 1.145-.18 11.57 11.57 0 0 0 1.889-.592 12.38 12.38 0 0 0 1.373-.641c.21-.111.408-.244.607-.366a14.092 14.092 0 0 0 3.087-2.588l.2-.238a15.26 15.26 0 0 0 2.408-3.866 14.694 14.694 0 0 0 1.153-4.814 13.363 13.363 0 0 0 .007-1.394l-.04-.45c-.012-.15-.049-.576-.084-.851zm3.023-17.343c4.227 2.83 8.62 5.703 13.155 8.598a12.021 12.021 0 0 0 2.379-2.04 12.808 12.808 0 0 0 2.231-3.49 12.287 12.287 0 0 0 .982-4.102 10.922 10.922 0 0 0-.138-2.543 9.348 9.348 0 0 0-.682-2.264 8.284 8.284 0 0 0-1.173-1.884 7.509 7.509 0 0 0-1.587-1.443q-6.459-4.333-12.655-8.723l.017.196a29.387 29.387 0 0 1-2.737 8.667 30.36 30.36 0 0 1-4.529 6.614l.299.09a21.115 21.115 0 0 1 4.427 2.325zm4.978 54.15c-.027-.31-.054-.622-.185-.924-.13-.302-.025-.3-.12-.443-.093-.142-.177-.577-.282-.858-.105-.281-.091-.247-.137-.371a11.246 11.246 0 0 0-.514-1.117l-.006-.07a10.413 10.413 0 0 0-.645-1.024l-.248-.315c-.17-.218-.351-.434-.531-.64l-.293-.3c-.192-.204-.405-.383-.618-.562l-.288-.242a9.672 9.672 0 0 0-.927-.652 9.51 9.51 0 0 0-1.948-.912 9.985 9.985 0 0 0-4.035-.465l-.311.026a11.732 11.732 0 0 0-4.37 1.434 13.097 13.097 0 0 0-2.011 1.334 13.78 13.78 0 0 0-4.025 5.584 12.912 12.912 0 0 0-.798 3.274 12.46 12.46 0 0 0-.086 1.424 11.292 11.292 0 0 0 .922 4.507 10.494 10.494 0 0 0 .492.992 10.262 10.262 0 0 0 1.993 2.51 10.1 10.1 0 0 0 2.828 1.824 10.24 10.24 0 0 0 1.008.378l.357.097q.428.114.864.192l.4.07c.33.053.67.082 1.02.098l.253-.021a11.003 11.003 0 0 0 1.159-.03l.219-.02a11.269 11.269 0 0 0 1.963-.4 11.709 11.709 0 0 0 2.433-1.011 12.727 12.727 0 0 0 3.532-2.94 13.433 13.433 0 0 0 2.323-4.045 13.282 13.282 0 0 0 .755-4.71 12.727 12.727 0 0 0-.119-1.383c.018-.06-.016-.184-.04-.322zm1.37-18.605l.378.212c5.77 3.486 11.825 7.052 18.106 10.669.246-.242.491-.496.713-.759a11.292 11.292 0 0 0 2.026-3.437 11.176 11.176 0 0 0 .675-4.03 10.552 10.552 0 0 0-.343-2.502 9.591 9.591 0 0 0-.89-2.246 9.013 9.013 0 0 0-1.321-1.849 8.527 8.527 0 0 0-1.747-1.405q-7.167-4.342-14.117-8.725a27.374 27.374 0 0 1-2.097 8.426 27.987 27.987 0 0 1-2.715 4.879l.583.425c.273.07.514.177.735.309zm-32 8.412a21.855 21.855 0 0 1-5.996-4.361 22.087 22.087 0 0 1-5.085-8.341 24.077 24.077 0 0 1-1.18-9.665 26.703 26.703 0 0 1 2.385-9.112 28.37 28.37 0 0 1 4.367-6.729l-2.799-1.489a20.583 20.583 0 0 1-5.985-4.908 21.647 21.647 0 0 1-4.402-8.91 24.517 24.517 0 0 1-.233-9.712 28.716 28.716 0 0 1 3.054-8.775 31.065 31.065 0 0 1 5.197-7.067 29.515 29.515 0 0 1 7.033-5.309 24.956 24.956 0 0 1 9.041-2.892l.588-.05-7.081-10.76-9.12-13.939-9.112-13.836-1.369 125.953a18.512 18.512 0 0 1 6.723 1.337l2.503 1.016 8.482 3.427c.084-.24.154-.501.25-.742a26.368 26.368 0 0 1 2.725-5.158zm38.74 47.05c-.013-.138-.025-.276-.093-.398-.069-.122-.157-.602-.24-.896-.083-.295-.095-.294-.154-.44-.059-.146-.222-.562-.339-.83-.116-.269-.102-.247-.17-.369a11.57 11.57 0 0 0-.607-1.109 11.257 11.257 0 0 0-.738-1.016l-.257-.292c-.193-.215-.386-.43-.6-.633l-.317-.298c-.213-.19-.427-.381-.662-.547l-.311-.24a10.853 10.853 0 0 0-.983-.624 10.61 10.61 0 0 0-2.05-.892 10.714 10.714 0 0 0-4.126-.434l-.334.029a11.489 11.489 0 0 0-4.337 1.419 12.114 12.114 0 0 0-1.838 1.319 12.45 12.45 0 0 0-3.792 5.587 11.998 11.998 0 0 0-.601 3.536c.03.357-.007.72.023 1.078a11.42 11.42 0 0 0 1.241 4.433 11.13 11.13 0 0 0 5.758 5.241c.337.134.673.256 1.018.354l.368.096q.44.113.888.19l.4.07q.53.071 1.065.095l.23-.02q.543-.047 1.159-.042l.3-.026a11.836 11.836 0 0 0 4.25-1.341l.115-.01a11.697 11.697 0 0 0 3.396-2.906 12.137 12.137 0 0 0 2.107-3.99 12.357 12.357 0 0 0 .49-4.687 12.16 12.16 0 0 0-.273-1.428zm.695-18.883a1492.97 1492.97 0 0 0 19.875 10.853 9.939 9.939 0 0 0 2.285-2.055 10.135 10.135 0 0 0 1.8-3.383 10.413 10.413 0 0 0-.113-6.424 10.02 10.02 0 0 0-1.057-2.162 9.765 9.765 0 0 0-1.514-1.809 9.534 9.534 0 0 0-1.884-1.37q-7.758-4.326-15.322-8.69a25.604 25.604 0 0 1-5.098 14.56l.667.325zm13.443 52.26a12.01 12.01 0 0 0-.267-1.347c-.011-.127-.022-.254-.114-.373-.084-.307-.191-.611-.299-.915l-.164-.416a9.595 9.595 0 0 0-.397-.837l-.3-.392a11.015 11.015 0 0 0-1.494-2.1l-.28-.29a10.96 10.96 0 0 0-.634-.62l-.34-.295a15.95 15.95 0 0 0-.696-.544l-.323-.24a11.743 11.743 0 0 0-1.041-.63 11.57 11.57 0 0 0-2.082-.842 11.327 11.327 0 0 0-4.181-.418l-.358.03a11.338 11.338 0 0 0-7.631 4.293 11.385 11.385 0 0 0-2.335 8.492 11.64 11.64 0 0 0 1.48 4.379 11.79 11.79 0 0 0 .852 1.25 11.813 11.813 0 0 0 5.19 3.908c.348.132.707.252 1.076.36l.369.096q.45.112.922.188l.41.057c.354.051.716.078 1.076.082l.242-.021c.346-.03.704-.06 1.06-.092l.358-.03a11.188 11.188 0 0 0 4.35-1.397 11.038 11.038 0 0 0 3.306-2.886 11.292 11.292 0 0 0 1.982-3.956 11.57 11.57 0 0 0 .371-2.564 11.94 11.94 0 0 0-.124-1.975zm-3.35-14.622q7.066 3.7 14.585 7.535l4.349 2.227.29-.142a9.36 9.36 0 0 0 4.494-5.787 9.8 9.8 0 0 0 .22-3.92 10.262 10.262 0 0 0-.662-2.428 10.413 10.413 0 0 0-1.183-2.14 10.563 10.563 0 0 0-1.628-1.776 10.413 10.413 0 0 0-1.985-1.35q-8.208-4.287-16.258-8.622a24.644 24.644 0 0 1-5.123 15.213 17.875 17.875 0 0 1 2.914 1.2zm17.495 48.068a11.94 11.94 0 0 0-.324-1.33c-.01-.128-.08-.25-.126-.385-.107-.304-.215-.608-.345-.91l-.186-.403a13.76 13.76 0 0 0-.432-.833l-.205-.366a12.38 12.38 0 0 0-.722-1.1 12.368 12.368 0 0 0-.852-.994l-.292-.288a11.409 11.409 0 0 0-.669-.616l-.35-.284a10.826 10.826 0 0 0-.73-.53l-.346-.237a10.603 10.603 0 0 0-1.075-.615l-.475.958-2.356 4.732 2.368-4.733.475-.958a12.276 12.276 0 0 0-2.138-.826 11.813 11.813 0 0 0-4.24-.413l-.369.031a11.176 11.176 0 0 0-4.302 1.416 10.783 10.783 0 0 0-5.086 6.744 11.06 11.06 0 0 0-.234 3.898l.055.634a11.882 11.882 0 0 0 1.65 4.33 12.333 12.333 0 0 0 .974 1.332 12.438 12.438 0 0 0 5.272 3.773c.361.143.731.262 1.111.357l.266.117q.462.11.933.186l.4.059q.552.069 1.169.085l.207-.018c.392-.034.789-.01 1.158-.041l.253-.022a11.234 11.234 0 0 0 3.125-.803 10.841 10.841 0 0 0 1.204-.58 10.598 10.598 0 0 0 3.1-2.706l.137-.163a10.69 10.69 0 0 0 1.821-3.93 11.338 11.338 0 0 0 .114-4.61zm-1.015-20.281c6.698 3.348 13.72 6.82 21.214 10.494a8.943 8.943 0 0 0 1.118-2.79 9.487 9.487 0 0 0 .084-3.887 10.216 10.216 0 0 0-.754-2.408 10.667 10.667 0 0 0-1.285-2.119 11.05 11.05 0 0 0-3.75-3.091q-8.496-4.262-16.994-8.547a23.857 23.857 0 0 1-2.336 11.175 25.107 25.107 0 0 1 2.652 1.12zm17.98 52.09a11.905 11.905 0 0 0-.404-1.312c-.01-.127-.102-.247-.16-.381-.058-.134-.248-.583-.388-.86l-.222-.423a9.311 9.311 0 0 0-.486-.794l-.227-.34a11.732 11.732 0 0 0-1.739-1.988l-.314-.275c-.226-.2-.463-.39-.712-.577l-.371-.27c-.248-.176-.506-.34-.775-.502l-.355-.213c-.354-.202-.718-.38-1.092-.545l-.081.007-2.54 5.84 2.54-5.84a12.727 12.727 0 0 0-2.2-.728 12.125 12.125 0 0 0-4.28-.224l-.37.032a11.095 11.095 0 0 0-4.23 1.584 10.413 10.413 0 0 0-4.653 6.915 10.945 10.945 0 0 0 .045 4.026l.04.473a12.01 12.01 0 0 0 1.933 4.234 12.727 12.727 0 0 0 1.101 1.322 12.785 12.785 0 0 0 5.48 3.488c.37.12.74.227 1.118.31l.378.072q.472.087.953.15l.4.047c.373.026.746.04 1.164.04l.207-.018 1.153-.1.311-.026a11.454 11.454 0 0 0 1.662-.387 10.864 10.864 0 0 0 2.605-1.177 10.413 10.413 0 0 0 2.292-1.974l.138-.151a10.32 10.32 0 0 0 2.242-4.838 10.887 10.887 0 0 0 .106-2.82 11.466 11.466 0 0 0-.32-1.819zm-2.24-20.21a6463.82 6463.82 0 0 0 21.53 9.317l.054-.19a9.256 9.256 0 0 0 .003-3.868 10.286 10.286 0 0 0-.81-2.392 10.887 10.887 0 0 0-1.342-2.103 11.304 11.304 0 0 0-1.764-1.74 11.489 11.489 0 0 0-2.1-1.318q-8.75-4.251-17.444-8.52a22.55 22.55 0 0 1-1.492 9.64 25.535 25.535 0 0 1 3.387 1.172zm23.14 51.866a11.674 11.674 0 0 0-.357-1.316c-.012-.138-.092-.259-.15-.393-.058-.135-.225-.585-.366-.875l-.198-.412c-.14-.279-.303-.555-.465-.82l-.216-.341a12.727 12.727 0 0 0-.779-1.094 13.074 13.074 0 0 0-.897-.98l-.303-.276a17.435 17.435 0 0 0-.691-.614l-.361-.282a17.918 17.918 0 0 0-.767-.538l-.344-.226c-.355-.213-.721-.414-1.086-.603a12.97 12.97 0 0 0-2.256-.85 12.287 12.287 0 0 0-4.03-.408l-.623.053a11.038 11.038 0 0 0-4.28 1.414 10.413 10.413 0 0 0-1.519 1.095 10.066 10.066 0 0 0-3.35 5.607 10.934 10.934 0 0 0-.08 4.06l.038.437a12.195 12.195 0 0 0 1.776 4.307 12.808 12.808 0 0 0 1.06 1.372 12.843 12.843 0 0 0 5.478 3.743c.3.114.61.215.919.293l.38.095q.462.11.945.185l.411.058q.552.068 1.11.078l.22-.018 1.152-.1.311-.026a11.5 11.5 0 0 0 1.475-.267 10.876 10.876 0 0 0 2.854-1.116 10.297 10.297 0 0 0 4.955-6.78 11.003 11.003 0 0 0-.015-4.492zm-1.562-20.292l9.279 4.45 8.685 4.164a8.573 8.573 0 0 0 .202-.888 9.256 9.256 0 0 0-.182-3.863 10.286 10.286 0 0 0-.934-2.347 10.957 10.957 0 0 0-1.452-2.035 11.454 11.454 0 0 0-1.862-1.662 11.686 11.686 0 0 0-2.154-1.278l-18.085-7.733a22.897 22.897 0 0 1-.762 8.95 25.303 25.303 0 0 1 2.884.587 25.639 25.639 0 0 1 4.344 1.624zm29.852 67.105a23.14 23.14 0 0 1-3.483 3.784 2897.814 2897.814 0 0 1 18.215 7.21 10.633 10.633 0 0 0 1.194.386 10.413 10.413 0 0 0 1.183.258 10.216 10.216 0 0 0 2.33.078l.138-.012a9.603 9.603 0 0 0 3.733-1.158 9.175 9.175 0 0 0 2.81-2.425 9.013 9.013 0 0 0 1.605-3.343 9.325 9.325 0 0 0 .106-3.888 9.892 9.892 0 0 0-.753-2.409 10.413 10.413 0 0 0-1.342-2.102 10.899 10.899 0 0 0-1.742-1.755 11.234 11.234 0 0 0-2.089-1.33q-8.705-4.266-17.48-8.527a23.429 23.429 0 0 1-.51 6.605 23.047 23.047 0 0 1-3.95 8.62zm-8.35-16.06a11.709 11.709 0 0 0-.346-1.318c-.012-.138-.093-.27-.151-.405-.058-.134-.225-.585-.353-.864l-.2-.424c-.14-.278-.291-.556-.453-.82l-.216-.353a12.357 12.357 0 0 0-.768-1.095 12.97 12.97 0 0 0-.958-1.01l-.303-.275c-.227-.213-.454-.426-.703-.613l-.36-.283a11.217 11.217 0 0 0-.755-.527l-.357-.236a12.848 12.848 0 0 0-1.11-.613 12.877 12.877 0 0 0-2.183-.822 12.24 12.24 0 0 0-4.285-.398l-.38.033a11.05 11.05 0 0 0-4.28 1.414 10.286 10.286 0 0 0-4.892 6.703 11.038 11.038 0 0 0-.123 3.97l.046.531a12.24 12.24 0 0 0 1.773 4.272 12.727 12.727 0 0 0 1.01 1.353 13.062 13.062 0 0 0 2.113 2.001 12.889 12.889 0 0 0 3.516 1.857c.25.083.503.178.764.248l.38.095q.462.111.933.187l.4.058q.552.069 1.169.085l.196-.017 1.083-.093.346-.03a11.362 11.362 0 0 0 2.45-.547 10.841 10.841 0 0 0 1.89-.848 10.482 10.482 0 0 0 5.035-6.786 11.003 11.003 0 0 0 .013-4.437zm-1.47-20.3l18.346 8.87a9.325 9.325 0 0 0-.22-2.547 10.181 10.181 0 0 0-.81-2.392 10.772 10.772 0 0 0-1.342-2.103 11.362 11.362 0 0 0-1.776-1.74 11.697 11.697 0 0 0-2.122-1.315l-17.698-8.497a23.406 23.406 0 0 1-.452 6.484c-.081.401-.21.784-.315 1.188.673.128 1.335.268 2.001.455a25.581 25.581 0 0 1 4.33 1.59zm-164.17-146.86a1.874 1.874 0 0 0-1.496-.382 12.947 12.947 0 0 0-2.53.566 32.858 32.858 0 0 0-3.317 1.26 43.51 43.51 0 0 0-3.72 1.843 44.433 44.433 0 0 0-3.157 1.909 24.297 24.297 0 0 0-2.366 1.783 8.006 8.006 0 0 0-1.382 1.478 1.076 1.076 0 0 0-.25 1.008l82.13 165.108a3.471 3.471 0 0 0 .618-.239c.415-.175.995-.457 1.73-.81l2.63-1.296 3.339-1.68 3.7-1.945 3.129-1.686c.91-.497 1.662-.922 2.215-1.248a7.717 7.717 0 0 0 .98-.63c-16.708-33.26-65.547-131.791-82.253-165.04zm-45.423 6.141a32.095 32.095 0 0 0-2.85-2.077 45.252 45.252 0 0 0-3.563-2.143 39.262 39.262 0 0 0-3.322-1.619 23.8 23.8 0 0 0-2.793-1.013 7.902 7.902 0 0 0-2.005-.362l-.254.022a.902.902 0 0 0-.748.343l-97.637 163.044a1.84 1.84 0 0 0 .547.428c.37.247.923.595 1.621 1.022l2.523 1.513 3.204 1.873 3.662 2.076 3.122 1.729c.913.49 1.68.9 2.25 1.188a7.544 7.544 0 0 0 1.065.489c19.567-33.04 77.926-130.189 97.497-163.182a1.944 1.944 0 0 0-.555-1.323 12.727 12.727 0 0 0-1.765-2.02zm12.924 21.694l22.76 78.342.65-.149 1.85-.507 2.822-.801 3.568-1.039 4.02-1.194 3.395-1.035.253-.022-37.81-76.047zm-29.306-47.41c.646-.056 1.303-.112 1.945-.075a25.754 25.754 0 0 1 6.99 1.07 42.149 42.149 0 0 1 5.01 1.81 58.73 58.73 0 0 1 4.848 2.358 57.696 57.696 0 0 1 5.024 3.051 50.445 50.445 0 0 1 4.529 3.373 47.427 47.427 0 0 1 2.342 2.12l1.162.005c.397-.383.805-.766 1.237-1.14a42.635 42.635 0 0 1 4.187-3.171 45.785 45.785 0 0 1 4.562-2.716c1.623-.836 3.467-1.808 5.201-2.573a51.173 51.173 0 0 1 5.218-1.982 30.672 30.672 0 0 1 6.318-1.334l.15-.013a19.97 19.97 0 0 1 15.347 4.926c.39.35.77.723 1.125 1.065.383.408.772.874 1.111 1.309.34.435.737 1.005 1.06 1.523.324.518.63 1.107.892 1.584l1.397 2.736 9.713.058 9.295.058 25.086.163-24.964-10.079-8.579-3.465-8.59-3.464-9.287.034-9.288.022-128.871.345 48.305 9.125 3.541.67a19.252 19.252 0 0 1 13.973-7.393zM89.843 55.946a11.743 11.743 0 0 0-6.862-1.476 12.97 12.97 0 0 0-2.695.534 14.404 14.404 0 0 0-8.257 6.738 14.404 14.404 0 0 0-1.573 10.587 11.824 11.824 0 0 0 15.252 8.685 14.775 14.775 0 0 0 9.835-17.279 12.01 12.01 0 0 0-5.7-7.789zm93.296 46.37a93.716 93.716 0 0 1-7.737 34.89 98.344 98.344 0 0 1-19.489 29.235 91.91 91.91 0 0 1-27.801 19.813 80.075 80.075 0 0 1-26.436 7.085q-2.974.256-5.98.27a69.014 69.014 0 0 1-30.362-6.674 67.244 67.244 0 0 1-22.85-17.89 73.388 73.388 0 0 1-13.636-25.79 84.298 84.298 0 0 1-3.084-31.09 94.676 94.676 0 0 1 8.013-31.138 98.483 98.483 0 0 1 17.204-26.1 93.276 93.276 0 0 1 24.28-19.034 81.857 81.857 0 0 1 29.568-9.421l2.178-.188a70.657 70.657 0 0 1 27.845 3.072 66.897 66.897 0 0 1 25.112 14.756 70.993 70.993 0 0 1 17.252 25.038 81.764 81.764 0 0 1 5.876 33.17zm-72.23-46.512l-9.773-8.704-.277-.243-.125-.105a6.942 6.942 0 0 0-.672-.523 25.326 25.326 0 0 0-23.88-4.493 28.23 28.23 0 0 0-16.287 13.143 28.23 28.23 0 0 0-2.98 20.672 25.627 25.627 0 0 0 16.103 18.296l14.247 5.509a6.838 6.838 0 0 0 .693.23 23.406 23.406 0 0 0 9.648 1.19 25.13 25.13 0 0 0 19.556-12.809c6.351-11.068 3.557-25.041-6.254-32.163z',
    movePoints: 0,
    hitPoints: 20,
    attackRangeCutOff: 8,
    attackRangeMax: 50,
    attackDamage: 15,
  },
]

type UnitTypes = { [unitTypeId: string]: IUnitType }

const DefaultUnitTypes = zipObj(units.map(u => u.unitTypeId), units)

let UnitTypes = fetchState<UnitTypes>('UnitTypes') || DefaultUnitTypes
export default UnitTypes

export { DefaultUnitTypes }

export function updateUnitTypes(unitTypes: UnitTypes) {
  UnitTypes = unitTypes
  storeState('UnitTypes', UnitTypes)
}

export function unitTypeOf(unit: IUnit) {
  return UnitTypes[unit.unitTypeId]
}

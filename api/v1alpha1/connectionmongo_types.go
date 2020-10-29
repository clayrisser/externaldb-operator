/*


Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// ConnectionMongoSpec defines the desired state of ConnectionMongo
type ConnectionMongoSpec struct {
	// mongo hostname
	Hostname string `json:"foo,omitempty"`

	// mongo port
	Port int64 `json:"foo,omitempty"`

	// mongo username
	Username string `json:"foo,omitempty"`

	// mongo password
	Password string `json:"foo,omitempty"`

	// mongo database name
	Database string `json:"foo,omitempty"`

	// mongo connection url
	Url string `json:"foo,omitempty"`

	// secret name containing `MONGO_PASSWORD` or `MONGO_CONNECITON_URL`
	SecretName string `json:"foo,omitempty"`

	// config map name containing `MONGO_HOSTNAME`, `MONGO_PORT`, `MONGO_USERNAME` or `MONGO_DATABASE`
	ConfigMapName string `json:"foo,omitempty"`
}

// ConnectionMongoStatus defines the observed state of ConnectionMongo
type ConnectionMongoStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "make" to regenerate code after modifying this file
}

// +kubebuilder:object:root=true
// +kubebuilder:subresource:status

// ConnectionMongo is the Schema for the connectionmongoes API
type ConnectionMongo struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   ConnectionMongoSpec   `json:"spec,omitempty"`
	Status ConnectionMongoStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// ConnectionMongoList contains a list of ConnectionMongo
type ConnectionMongoList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []ConnectionMongo `json:"items"`
}

func init() {
	SchemeBuilder.Register(&ConnectionMongo{}, &ConnectionMongoList{})
}
